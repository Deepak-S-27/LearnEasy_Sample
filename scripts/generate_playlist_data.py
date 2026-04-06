import json
import re
from pathlib import Path

from yt_dlp import YoutubeDL

ROOT = Path(__file__).resolve().parents[1]


def fetch_playlist_entries(url: str) -> list[dict]:
    ydl_opts = {
        "quiet": True,
        "skip_download": True,
        "extract_flat": "in_playlist",
    }
    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    entries = []
    for idx, entry in enumerate(info.get("entries", []), start=1):
        video_id = entry.get("id")
        if not video_id:
            continue
        entries.append(
            {
                "index": idx,
                "title": (entry.get("title") or "").strip(),
                "url": f"https://www.youtube.com/watch?v={video_id}",
            }
        )
    return entries


def classify_physics_unit(title: str) -> tuple[int, str]:
    t = title.lower()
    if "electrostatics" in t:
        return 1, "Unit 1 - Electrostatics"
    if (
        "current electricity" in t
        or "thermoelectric" in t
        or "seebeck" in t
        or "peltier" in t
        or "thomson effect" in t
    ):
        return 2, "Unit 2 - Current Electricity"
    if (
        "magnetism" in t
        or "magnetic effects" in t
        or "biot savart" in t
        or "ampere" in t
        or "galvanometer" in t
        or "cyclotron" in t
        or "lorentz" in t
    ):
        return 3, "Unit 3 - Magnetism and Magnetic Effects"
    if (
        "electromagnetic induction" in t
        or "alternating current" in t
        or "ac circuit" in t
        or "transformer" in t
        or "induct" in t
        or "generator" in t
    ):
        return 4, "Unit 4 - Electromagnetic Induction and AC"
    if "electromagnetic waves" in t:
        return 5, "Unit 5 - Electromagnetic Waves"
    if "ray optics" in t:
        return 6, "Unit 6 - Ray Optics"
    if "wave optics" in t:
        return 7, "Unit 7 - Wave Optics"
    if (
        "dual nature" in t
        or "photoelectric" in t
        or "de broglie" in t
        or "x ray" in t
    ):
        return 8, "Unit 8 - Dual Nature of Radiation and Matter"
    if (
        "atomic and nuclear" in t
        or "bohr" in t
        or "rutherford" in t
        or "thomson" in t
    ):
        return 9, "Unit 9 - Atomic and Nuclear Physics"
    return 10, "Unit 10 - Additional Topics"


def classify_chemistry_unit(title: str) -> tuple[int, str]:
    t = title.lower()
    if "metallurgy" in t:
        return 1, "Unit 1 - Metallurgy"
    if "p-block" in t:
        return 3, "Unit 3 - P-Block Elements"
    if "transition" in t:
        return 4, "Unit 4 - Transition and Inner Transition Elements"
    if "solid state" in t:
        return 6, "Unit 6 - Solid State"
    if "chemical kinetics" in t:
        return 7, "Unit 7 - Chemical Kinetics"
    if (
        "hydroxy compounds" in t
        or "ethers" in t
        or "lucas test" in t
        or "victor meyer" in t
    ):
        return 11, "Unit 11 - Hydroxy Compounds and Ethers"

    unit_match = re.search(r"unit\s*(\d+)", t)
    if unit_match:
        unit_num = int(unit_match.group(1))
        return unit_num, f"Unit {unit_num}"

    return 12, "Unit 12 - Additional Topics"


def build_unit_data(entries: list[dict], classifier) -> list[dict]:
    grouped: dict[tuple[int, str], list[dict]] = {}
    for entry in entries:
        key = classifier(entry["title"])
        grouped.setdefault(key, []).append(entry)

    units = []
    for chapter_idx, (unit_num, unit_name) in enumerate(
        sorted(grouped.keys(), key=lambda item: item[0]),
        start=1,
    ):
        unit_entries = grouped[(unit_num, unit_name)]
        units.append(
            {
                "chapter": chapter_idx,
                "name": unit_name,
                "exercises": [
                    {
                        "id": f"u{unit_num}-{idx + 1}",
                        "label": item["title"],
                        "url": item["url"],
                    }
                    for idx, item in enumerate(unit_entries)
                ],
            }
        )
    return units


def main() -> None:
    physics_url = (
        "https://www.youtube.com/watch?v=DUz5zsk4uz8&list=PL2qtWkm0Z4ccui6LY1cmczoyQYhKQFTMA"
    )
    chemistry_url = (
        "https://www.youtube.com/watch?v=4-zRGn3lSA0&list=PL2qtWkm0Z4cf6NVtrhEtaYTkL8zSrTz8r"
    )

    physics_entries = fetch_playlist_entries(physics_url)
    chemistry_entries = fetch_playlist_entries(chemistry_url)

    physics_data = build_unit_data(physics_entries, classify_physics_unit)
    chemistry_data = build_unit_data(chemistry_entries, classify_chemistry_unit)

    (ROOT / "lib" / "physics-playlist-data.json").write_text(
        json.dumps(physics_data, ensure_ascii=True, indent=2),
        encoding="utf-8",
    )
    (ROOT / "lib" / "chemistry-playlist-data.json").write_text(
        json.dumps(chemistry_data, ensure_ascii=True, indent=2),
        encoding="utf-8",
    )

    physics_count = sum(len(unit["exercises"]) for unit in physics_data)
    chemistry_count = sum(len(unit["exercises"]) for unit in chemistry_data)
    print(f"Physics units: {len(physics_data)} | videos: {physics_count}")
    print(f"Chemistry units: {len(chemistry_data)} | videos: {chemistry_count}")


if __name__ == "__main__":
    main()
