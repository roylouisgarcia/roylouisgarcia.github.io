import tkinter as tk
from tkinter import colorchooser

def load_colors():
    with open("colors.txt", "r") as file:
        data = file.read()

    for color in data.split("\n"):
        color_label = tk.Label(root, text=f"{color}")
        color_label.pack()
        button = tk.Button(root, command=choose_color, bg=color, fg="white", width=20, height=2)
        button.pack()

def choose_color():
    color_code = colorchooser.askcolor(title ="Choose color")
    color_label = tk.Label(root, text=f"Color code: {color_code[1]}")
    color_label.pack()
    button.setvar("bg", color_code[1])


def update_color(color_code):
    #open a file where all occurences of the color code will be replaced by the new color code
    with open("colors.txt", "r") as file:
        data = file.read()
        data = data.replace("test", color_code)
    with open("colors.txt", "w") as file:
        file.write(data)
    
root = tk.Tk()
root.geometry("400x900")
btn_color = tk.StringVar()
button = tk.Button(root, text="Load Colors", command=load_colors)
button.pack()

root.mainloop()