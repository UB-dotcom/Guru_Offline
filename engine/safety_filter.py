"""
Local Safety Filter for Guru Offline.
Performs on-device safety checks before queries reach the RAG retriever and SLM inference engine.
Prevents dangerous content, vulgarity, cheating, and off-topic distractions while maintaining
an encouraging, educational tutor persona.
"""

import re
from typing import Dict, Any, Tuple

class LocalSafetyFilter:
    """
    On-device, ultra-fast regex and heuristic safety evaluator.
    Executes in < 2ms without requiring external cloud moderation APIs.
    """

    DANGEROUS_PATTERNS = [
        r"\b(make|build|create|synthesize)\s+(a\s+)?(bomb|explosive|poison|weapon|gun|meth|drug)\b",
        r"\b(how\s+to\s+commit\s+suicide|kill\s+myself|harm\s+myself|cut\s+myself)\b",
        r"\b(hack|crack|bypass|steal|ddos)\s+(wifi|password|account|bank|server)\b",
        r"\b(terrorist|assassinate|murder|attack)\b"
    ]

    PROFANITY_PATTERNS = [
        r"\b(fuck|shit|bitch|bastard|asshole|cunt|dick|pussy)\b",
        r"\b(chutiya|bhenchod|madarchod|gaand|harami)\b"  # Local/Hindi common abusive terms
    ]

    CHEATING_PATTERNS = [
        r"\b(give\s+me\s+the\s+answers\s+to\s+my\s+live\s+exam|leak\s+board\s+paper|cheat\s+on\s+test)\b",
        r"\b(solve\s+this\s+immediately\s+without\s+explanation\s+during\s+my\s+exam)\b"
    ]

    OFF_TOPIC_PATTERNS = [
        r"\b(who\s+won\s+ipl|cricket\s+score|movie\s+review|actor\s+gossip|play\s+minecraft|fortnite\s+vbucks)\b",
        r"\b(tell\s+me\s+a\s+joke\s+about\s+celebrity|what\s+is\s+my\s+horoscope)\b"
    ]

    def __init__(self):
        self.compiled_dangerous = [re.compile(p, re.IGNORECASE) for p in self.DANGEROUS_PATTERNS]
        self.compiled_profanity = [re.compile(p, re.IGNORECASE) for p in self.PROFANITY_PATTERNS]
        self.compiled_cheating = [re.compile(p, re.IGNORECASE) for p in self.CHEATING_PATTERNS]
        self.compiled_off_topic = [re.compile(p, re.IGNORECASE) for p in self.OFF_TOPIC_PATTERNS]

    def check(self, user_query: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Evaluates query safety.
        Returns:
            is_safe (bool)
            safe_response (str): empty if safe, educational guardrail message if unsafe
            metadata (dict): category, matched rule, latency
        """
        text = user_query.strip()
        if not text:
            return False, "Please type a question about your subject!", {"category": "empty"}

        # 1. Danger / Violence / Self-harm
        for pattern in self.compiled_dangerous:
            if pattern.search(text):
                return False, (
                    "I cannot assist with queries involving weapons, dangerous substances, or harm. "
                    "If you or someone you know needs help, please reach out to trusted adults, a counselor, "
                    "or an emergency helpline. I am here to help you learn science, math, and school subjects safely."
                ), {"category": "dangerous", "severity": "critical"}

        # 2. Profanity / Inappropriate Language
        for pattern in self.compiled_profanity:
            if pattern.search(text):
                return False, (
                    "Let's keep our learning space polite and respectful! "
                    "Please rephrase your question so we can focus on your studies."
                ), {"category": "inappropriate_language", "severity": "medium"}

        # 3. Direct Exam Cheating
        for pattern in self.compiled_cheating:
            if pattern.search(text):
                return False, (
                    "As your educational tutor, I won't help you bypass exams or tests dishonestly. "
                    "However, I would love to explain the underlying concepts step-by-step so you can solve it yourself with confidence!"
                ), {"category": "academic_integrity", "severity": "medium"}

        # 4. Off-Topic Non-Educational
        for pattern in self.compiled_off_topic:
            if pattern.search(text):
                return False, (
                    "Guru Offline is designed specifically for your school curriculum subjects (Mathematics, Science, Computer Science). "
                    "Please ask a question related to your downloaded curriculum chapters!"
                ), {"category": "off_topic", "severity": "low"}

        # Safe for RAG and SLM inference
        return True, "", {"category": "safe"}

if __name__ == "__main__":
    filter_engine = LocalSafetyFilter()
    test_queries = [
        "Explain Newton's second law",
        "How to make a bomb",
        "Solve 2x + 5 = 15 step by step",
        "Give me the answers to my live exam right now",
        "Who won IPL match yesterday"
    ]
    for q in test_queries:
        is_safe, resp, meta = filter_engine.check(q)
        print(f"Query: '{q}'")
        print(f"  Safe: {is_safe} | Category: {meta['category']}")
        if not is_safe:
            print(f"  Response: {resp[:70]}...")
        print()
