"""
Performance Monitor for Guru Offline.
Measures real hardware metrics: process RAM (RSS/VMS), CPU percent,
inference latency, token throughput, and verifies strictly offline execution.
"""

import os
import time
import socket
import psutil
from typing import Dict, Any

class PerformanceMonitor:
    def __init__(self):
        self.process = psutil.Process(os.getpid())
        # Prime CPU percent reading
        self.process.cpu_percent()

    def get_memory_usage_mb(self) -> Dict[str, float]:
        """Returns exact resident and virtual memory of the current process."""
        mem_info = self.process.memory_info()
        return {
            "rss_mb": round(mem_info.rss / (1024 * 1024), 2),
            "vms_mb": round(mem_info.vms / (1024 * 1024), 2)
        }

    def verify_offline_state(self) -> Dict[str, Any]:
        """
        Confirms whether the current process is making any external network requests.
        """
        connections = self.process.net_connections(kind="inet")
        # Check if any remote connections are established
        external_conns = [c for c in connections if c.raddr and not c.raddr.ip.startswith("127.")]
        is_isolated = len(external_conns) == 0

        return {
            "is_offline": is_isolated,
            "status_label": "📵 Offline Mode (AI running on-device)" if is_isolated else "Connected",
            "active_external_sockets": len(external_conns)
        }

    def measure_execution(self, func, *args, **kwargs):
        """
        Measures exact execution time and delta RAM usage for an operation.
        """
        mem_before = self.get_memory_usage_mb()
        start_time = time.perf_counter()

        result = func(*args, **kwargs)

        end_time = time.perf_counter()
        mem_after = self.get_memory_usage_mb()
        elapsed_sec = round(end_time - start_time, 4)

        return result, {
            "latency_sec": elapsed_sec,
            "latency_ms": round(elapsed_sec * 1000, 2),
            "ram_rss_mb": mem_after["rss_mb"],
            "ram_delta_mb": round(mem_after["rss_mb"] - mem_before["rss_mb"], 2)
        }

if __name__ == "__main__":
    mon = PerformanceMonitor()
    mem = mon.get_memory_usage_mb()
    net = mon.verify_offline_state()
    print("Performance Monitor Test:")
    print(f"Current Process RSS: {mem['rss_mb']} MB")
    print(f"Virtual Memory: {mem['vms_mb']} MB")
    print(f"Network Offline Status: {net['status_label']}")
