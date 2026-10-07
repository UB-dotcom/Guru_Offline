"""
Quantization Pipeline and Hardware Budget Profiler for Guru Offline.
Analyzes small language models (SLMs) for on-device inference on low-cost
Android hardware (~Rs. 8,000 budget phone with 2GB-3GB RAM, Cortex-A53 / MediaTek Helio G25/G35).
"""

import os
import json
import math

# Candidate SLM models for on-device deployment
CANDIDATE_MODELS = {
    "SmolLM-135M": {
        "params": 135_000_000,
        "vocab_size": 49152,
        "context_window": 2048,
        "hidden_size": 576,
        "num_layers": 30,
        "recommended_for": "Ultra-low end (2GB RAM devices like Redmi 9A / Realme C20)"
    },
    "SmolLM-360M": {
        "params": 360_000_000,
        "vocab_size": 49152,
        "context_window": 2048,
        "hidden_size": 960,
        "num_layers": 32,
        "recommended_for": "Low end (3GB RAM devices like Realme Narzo 50i / Samsung A03)"
    },
    "Qwen2.5-0.5B": {
        "params": 490_000_000,
        "vocab_size": 151936,
        "context_window": 4096,
        "hidden_size": 896,
        "num_layers": 24,
        "recommended_for": "Standard budget devices (3GB-4GB RAM)"
    },
    "TinyLlama-1.1B": {
        "params": 1_100_000_000,
        "vocab_size": 32000,
        "context_window": 2048,
        "hidden_size": 2048,
        "num_layers": 22,
        "recommended_for": "Mid-tier budget devices (4GB+ RAM only)"
    }
}

QUANT_FORMATS = {
    "FP16": {"bits_per_weight": 16, "overhead_factor": 1.15},
    "INT8 (Q8_0)": {"bits_per_weight": 8.5, "overhead_factor": 1.12},
    "INT4 (Q4_K_M)": {"bits_per_weight": 4.5, "overhead_factor": 1.10}
}

def calculate_hardware_profile(phone_ram_mb=2048):
    """
    Computes Android OS, background app, and safe usable RAM thresholds.
    """
    os_reserved_mb = 1100  # Android OS + System Services + Display Server
    safe_app_budget_mb = phone_ram_mb - os_reserved_mb - 200 # 200MB safety margin before OOM
    return {
        "total_phone_ram_mb": phone_ram_mb,
        "android_os_reserved_mb": os_reserved_mb,
        "safe_app_budget_mb": safe_app_budget_mb,
        "target_phone_price_inr": 8000,
        "target_soc": "MediaTek Helio G25 / G35 (Octa-core Cortex-A53 up to 2.0 GHz)"
    }

def analyze_models():
    results = {}
    hw = calculate_hardware_profile(2048)
    safe_budget = hw["safe_app_budget_mb"]

    for name, spec in CANDIDATE_MODELS.items():
        results[name] = {
            "parameters": f"{spec['params'] / 1e6:.0f}M",
            "formats": {},
            "compatibility": "Incompatible"
        }

        best_fit = None
        for fmt, q_info in QUANT_FORMATS.items():
            # Raw model weights in MB
            bytes_raw = (spec["params"] * q_info["bits_per_weight"]) / 8
            size_mb = round(bytes_raw / (1024 * 1024), 1)

            # Runtime RAM consumption = weights + KV Cache + activation buffer
            kv_cache_mb = round((spec["num_layers"] * 2 * spec["hidden_size"] * 512 * 2) / (1024 * 1024), 1)
            activation_buffer_mb = round(size_mb * 0.15 + 30, 1)
            total_runtime_ram_mb = round(size_mb + kv_cache_mb + activation_buffer_mb, 1)

            # Estimated latency on Cortex-A53 (approx 1.2 GFLOPs per core, 4 active cores)
            # INT4 has higher decoding efficiency and lower memory bandwidth bottleneck
            if "INT4" in fmt:
                tok_per_sec = round(16.5 * (135_000_000 / spec["params"]), 1)
            elif "INT8" in fmt:
                tok_per_sec = round(10.2 * (135_000_000 / spec["params"]), 1)
            else:
                tok_per_sec = round(4.5 * (135_000_000 / spec["params"]), 1)

            # Cap realistic bounds
            tok_per_sec = max(1.2, min(24.0, tok_per_sec))
            first_token_latency_sec = round(0.4 + (size_mb / 500), 2)

            is_viable_2gb = total_runtime_ram_mb <= safe_budget
            results[name]["formats"][fmt] = {
                "file_size_mb": size_mb,
                "runtime_ram_mb": total_runtime_ram_mb,
                "tokens_per_second": tok_per_sec,
                "first_token_latency_sec": first_token_latency_sec,
                "viable_on_2gb_phone": is_viable_2gb
            }

            if is_viable_2gb and fmt == "INT4 (Q4_K_M)":
                best_fit = "Ideal for 2GB RAM budget phone"
            elif is_viable_2gb and not best_fit:
                best_fit = "Viable for 2GB RAM budget phone"

        results[name]["compatibility"] = best_fit or "Requires 3GB+ or 4GB RAM"

    return {"hardware_budget": hw, "models": results}

def generate_model_spec():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    analysis = analyze_models()

    spec_path = os.path.join(base_dir, "model_spec.json")
    with open(spec_path, "w") as f:
        json.dump(analysis, f, indent=2)

    print(f"Hardware analysis and quantization specification saved to {spec_path}")
    print("\nTarget Architecture: Rs. 8,000 Android Phone (2GB RAM)")
    print(f"Safe RAM Budget for App & SLM: {analysis['hardware_budget']['safe_app_budget_mb']} MB")
    print("-" * 65)
    for model, details in analysis["models"].items():
        int4 = details["formats"]["INT4 (Q4_K_M)"]
        print(f"Model: {model:15} | Size: {int4['file_size_mb']:5.1f} MB | RAM: {int4['runtime_ram_mb']:5.1f} MB | {int4['tokens_per_second']:4.1f} tok/s | Viable: {int4['viable_on_2gb_phone']}")
    print("-" * 65)

if __name__ == "__main__":
    generate_model_spec()
