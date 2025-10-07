"""
    This python script is for extracting the spritesheets out of the OneShot Graphics.
    Created by Thefirey33 for feeding the noik.
    7 . 10 . 2025
"""

from PIL import Image, ImageDraw
from logging import Logger, getLogger, StreamHandler
import os, sys

# The logging system.
BASE_LOGGER = getLogger(__name__)
BASE_LOGGER.addHandler(StreamHandler())


def seperate_img_to_img_by_img(img_source, width_of_cell, height_of_cell):
    """
    This is the main function that seperates the tilesheet.
    Args:
        img_source (_type_): The Absolute Image Path.  
        width_of_cell (_type_): The Width of a single sprite.
        height_of_cell (_type_): The height of a single sprite.
    """
    if (os.path.exists(img_source)):
        with Image.open(img_source) as img:
            # This guy calculates how much we have to make images for the tilesheets to actually work.
            img_number_x, img_number_y = int(img.width / width_of_cell), int(img.height / height_of_cell)
            img_x, img_y = 0, 0
            for i in range(img_number_y):
                first_file_name = f"{input(f"Img Name for TileGrab {img_x}, {img_y}? ")}"
                for j in range(img_number_x):
                    new_file_name = f"{first_file_name}{j}.png"
                    new_created_img = Image.new("RGBA", [width_of_cell, height_of_cell])
                    for x in range(img_x, width_of_cell + img_x):
                        for y in range(img_y, height_of_cell + img_y):
                            # Cool mathematical stuff
                            location_of_img = (x, y)
                            color = img.getpixel(location_of_img)
                            new_created_img.putpixel((x - img_x, y - img_y), color) # type: ignore
                    img_x += width_of_cell
                    print(new_file_name)
                    new_created_img.save(new_file_name)
                img_y += height_of_cell
                img_x = 0
    else:
        BASE_LOGGER.error(f"There's no file called {img_source}")
        sys.exit(1)
            
    
if __name__ == "__main__":
    # Wanted to use sys.argv, but couldn't deal with it.
    # arguments_by_user = sys.argv
    seperate_img_to_img_by_img(input("Image Dir? "), int(input("Cell Width? ")), int(input("Cell Height? ")))