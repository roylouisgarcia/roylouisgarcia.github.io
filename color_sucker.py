import re
import os

def main():
    current_dir = os.path.dirname(__file__)
    css_file = os.path.join(current_dir, 'css\\style.css')
    color_pattern = re.compile(r'#([A-Fa-f0-9]{6})')
    colors = []


    with open(css_file, 'r') as file:
        for line in file:
            found_colors = color_pattern.findall(line)
            for color in found_colors:
                if color not in colors:
                    colors.append(color) 
    print(colors)

    with open('colors.txt', 'w') as file:
        for color in colors:
            file.write(f'#{color}\n')


if __name__ == '__main__':
    main()