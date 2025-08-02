import json

def load_story(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)

def play_scene(scene_key, story):
    while True:
        scene = story.get(scene_key)
        if not scene:
            print("The story seems to end here. (Missing scene)")
            break

        print("\n" + scene["text"] + "\n")
        choices = scene.get("choices", {})
        if not choices:
            print("The end.")
            break

        for i, option in enumerate(choices.keys(), 1):
            print(f"{i}. {option}")
        choice = input("\nChoose an option: ")

        try:
            index = int(choice) - 1
            next_scene_key = list(choices.values())[index]
            scene_key = next_scene_key
        except (ValueError, IndexError):
            print("Invalid choice. Try again.")

def main():
    story = load_story("masquerade_story_intro.json")
    # Add missing scenes directly to the story dictionary
    story["ask_locals"] = {
        "text": "You and Ayo visit Halima’s usual hangouts. A fruit vendor says she saw Halima arguing with a tall man in a red cloak two nights ago near the old train station.",
        "choices": {
            "Go to the old train station": "hospital_explore",
            "Tell Pitch what the vendor said": "cloak_pitch"
        }
    }

    story["call_pitch"] = {
        "text": "Pitch picks up, irritated. 'If she’s missing, it’s your problem too.' You hear typing. Then silence. He finally mutters: 'Last ping I had from her was near Obalende bridge. Might be Red Veil territory.'",
        "choices": {
            "Investigate Obalende bridge": "hospital_deeper",
            "Ask if he knows anything else": "cloak_pitch"
        }
    }

    play_scene("start", story)

if __name__ == "__main__":
    main()
