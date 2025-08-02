import tkinter as tk
from tkinter import messagebox
from story_engine import load_story
from PIL import Image, ImageTk
import os


class StoryGame:
    def __init__(self, root):
        self.root = root
        self.root.title("Chronicles Saga")
        self.root.geometry("850x550")
        self.root.configure(bg="#121212")

        self.story_data = None
        self.current_scene = None

        # Image references
        self.bg_photo = None
        self.speaker_photo = None

        # Create menu screen first
        self.show_menu()

    # ---------------- MENU SCREEN ----------------
    def show_menu(self):
        # Clear previous frames
        for widget in self.root.winfo_children():
            widget.destroy()

        # Load and set background image
        bg_image = Image.open(
            r"C:\Users\mrali\OneDrive\Documents\cloud game text\images\menu background.jpg"
        )
        bg_image = bg_image.resize((850, 550))
        self.bg_photo = ImageTk.PhotoImage(bg_image)

        bg_label = tk.Label(self.root, image=self.bg_photo)
        bg_label.place(x=0, y=0, relwidth=1, relheight=1)

        # Title
        title_label = tk.Label(
            self.root,
            text="CHRONICLES SAGA",
            font=("Helvetica", 24, "bold"),
            fg="#FFCC00",
            bg="#000000",
            pady=30,
        )
        title_label.place(relx=0.5, rely=0.2, anchor="center")

        # Start Button
        start_btn = tk.Button(
            self.root,
            text="Start Game (Level 1)",
            command=self.start_game,
            bg="#2e2e2e",
            fg="white",
            activebackground="#FFCC00",
            activeforeground="#121212",
            font=("Arial", 16),
            padx=20,
            pady=10,
            relief="flat",
        )
        start_btn.place(relx=0.5, rely=0.5, anchor="center")

        # Quit Button
        quit_btn = tk.Button(
            self.root,
            text="Quit",
            command=self.root.quit,
            bg="#2e2e2e",
            fg="white",
            activebackground="red",
            activeforeground="white",
            font=("Arial", 16),
            padx=20,
            pady=10,
            relief="flat",
        )
        quit_btn.place(relx=0.5, rely=0.65, anchor="center")

    # ---------------- GAME SCREEN ----------------
    def start_game(self):
        # Load Level 1 JSON
        self.story_data = load_story("masquerade_story.json")
        self.current_scene = "prologue"
        self.build_game_ui()
        self.show_scene()

    def build_game_ui(self):
        for widget in self.root.winfo_children():
            widget.destroy()

        # Title Bar
        self.title_label = tk.Label(
            self.root,
            text="LEVEL 1: Halima Investigation",
            font=("Helvetica", 18, "bold"),
            fg="#FFCC00",
            bg="#121212",
            pady=10,
        )
        self.title_label.pack(fill="x")

        # Speaker Image (left side)
        self.speaker_label = tk.Label(self.root, bg="#121212")
        self.speaker_label.pack(side="left", padx=10, pady=10)

        # Text Frame
        self.text_frame = tk.Frame(self.root, bg="#121212")
        self.text_frame.pack(side="left", fill="both", expand=True, padx=10, pady=5)

        self.text_area = tk.Text(
            self.text_frame,
            wrap="word",
            font=("Arial", 14),
            bg="#1e1e1e",
            fg="white",
            padx=10,
            pady=10,
            relief="flat",
            height=15,
        )
        self.text_area.pack(side="left", fill="both", expand=True)

        self.scrollbar = tk.Scrollbar(self.text_frame, command=self.text_area.yview)
        self.scrollbar.pack(side="right", fill="y")
        self.text_area.config(yscrollcommand=self.scrollbar.set)

        # Buttons for choices
        self.button_frame = tk.Frame(self.root, bg="#121212")
        self.button_frame.pack(fill="x", pady=10)

    def show_speaker_image(self, speaker):
        """
        Load speaker image from images/characters folder using speaker name.
        """
        image_path = f"images/characters/{speaker.lower()}.jpg"
        if os.path.exists(image_path):
            try:
                img = Image.open(image_path)
                img = img.resize((150, 150))
                self.speaker_photo = ImageTk.PhotoImage(img)
                self.speaker_label.config(image=self.speaker_photo)
            except:
                self.speaker_label.config(image="")
        else:
            self.speaker_label.config(image="")  # no image for narrator or missing speaker

    def show_scene(self):
        scene = self.story_data.get(self.current_scene)
        if not scene:
            messagebox.showerror("Error", f"Scene '{self.current_scene}' not found!")
            return

        # Show image for the current speaker
        speaker = scene.get("speaker", "Narrator")
        self.show_speaker_image(speaker)

        # Show text
        self.text_area.delete(1.0, tk.END)
        self.text_area.insert(tk.END, scene["text"])
        self.text_area.see("1.0")

        # Clear old buttons
        for widget in self.button_frame.winfo_children():
            widget.destroy()

        # Add choice buttons
        choices = scene.get("choices", {})
        if not choices:
            messagebox.showinfo("Level Complete", "You have reached the end of Level 1.")
            self.show_menu()  # Return to menu
            return

        for choice_text, next_scene in choices.items():
            btn = tk.Button(
                self.button_frame,
                text=choice_text,
                command=lambda ns=next_scene: self.choose(ns),
                bg="#2e2e2e",
                fg="white",
                activebackground="#FFCC00",
                activeforeground="#121212",
                font=("Arial", 12),
                padx=8,
                pady=8,
                relief="flat",
                wraplength=700,
                justify="left",
            )
            btn.pack(side="top", fill="x", padx=20, pady=5)

    def choose(self, next_scene):
        self.current_scene = next_scene
        self.show_scene()


if __name__ == "__main__":
    root = tk.Tk()
    app = StoryGame(root)
    root.mainloop()
