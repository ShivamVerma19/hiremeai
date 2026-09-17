"""
Run this manually whenever the resume PDF changes:
    python build_resume_cache.py

It parses the PDF with the LLM once and saves the result to resume_data.json.
main.py loads that JSON file at startup instead of calling the LLM.
"""

import json
from pathlib import Path

from main import parse_resume, read_pdf, RESUME_PATH

OUTPUT_PATH = Path("resume_data.json")


def main():
    print(f"Reading resume from {RESUME_PATH}...")
    resume_text = read_pdf(RESUME_PATH)

    print("Parsing with LLM (this may take a few seconds)...")
    resume = parse_resume(resume_text)

    OUTPUT_PATH.write_text(resume.model_dump_json(indent=2), encoding="utf-8")
    print(f"Saved parsed resume to {OUTPUT_PATH.resolve()}")


if __name__ == "__main__":
    main()