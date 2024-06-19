---
layout: post
title: 'Ebooks & Scripting - A Birthday Short Story'
topic: programming
show_excerpts: true
---

This is just another simple post on how I write Python scripts to help me with manually taxing tasks. I included a script in this post that made it easier for me to rename files in bulk. TLDR: The code to accomplish this is shown here ![python_script_1]({{ site.baseurl }}/assets/images/programming/python_script_0.png)

### My Birthday Gift/s: E-books

Every year, I treat myself by purchasing a product that I would not buy _unless I slept on it and still thought that I needed it_, waited enough time for it to go on “sale”, or if it would give me an immediate reward for a particular day like today, **04/13**.

Since I enjoy learning and enjoy a good book that entertains me, I decided to get a book and add it to my **collection**. I _call them collections_ until I find time to read most of them. For the rest, **I WILL READ THEM EVENTUALLY!** I feel obligated to mention that I am not a purist or someone who claims to love the smell of books, their pages, the ink …. and the feeling of turning actual pages. Some part of me might be that way, but I am someone who does not mind owning the exact book and its electronic version:

![Picture of books I own]({{ site.baseurl }}/assets/images/programming/books_i_read_1.jpg)

![Picture of books I own]({{ site.baseurl }}/assets/images/programming/books_i_read_2.jpg)

![Picture of books I own]({{ site.baseurl }}/assets/images/programming/books_i_read_3.jpg)

So, for my birthday this year, I finally subscribe to a month worth of downloads (mostly **Ebooks**) from Scribd.com <https://www.scribd.com>:

![Scribd.com]({{ site.baseurl }}/assets/images/programming/python_script_1.png)

What do I love about E-books? I love the portability of e-books and the convenience of using an e-book reader with text-to-speech features. I have Amazon Kindle (with Audible integration) <https://www.amazon.com/kindle-dbs/storefront> and (Readera) <https://readera.org/>:

![Readera App]({{ site.baseurl }}/assets/images/programming/readera.png)

### The Problem (_Not really a big one but a personal one_)

My only issue, which presents a challenge, is that Scribd.com downloaded files come with something extra. They are prefixed with some gibberish code, and initially, I had to rename them one by one.

![python_script_1]({{ site.baseurl }}/assets/images/programming/python_script_5.png)

Since I only plan to keep the subscription for a month (_pending a decision to extend_), I downloaded as many books as I could, and renaming them one by one became a task I didn't want to do repeatedly. **I had to automate:**

### The Solution: Scripting

I wanted to use Bash scripting, but I already had done that multiple times: E.g. <https://github.com/roylouisgarcia/fsrt>

So, I decided to write a Python script to do it.

Below is how I did it. Use it if you find it useful:

```python
import os

path = "./downloaded_files"
dir_list = os.listdir(path)

for i in dir_list:
    print(i)
    if i.__contains__('-'):
        b = i.split('-', 1)[1]
        old_file = os.path.join(path, i)
        new_file = os.path.join(path, b)
        os.rename(old_file, new_file)
    else:
        print ("do nothing")
```

Here, I only use the first "hyphen" as a cutoff point to what I wanted to take out from the file name and what to keep:

![Picture of my code and the pseudocode]({{ site.baseurl }}/assets/images/programming/python_script_0.png)

**Before** (note the filenames with the gibberish prefix):

![Before Running the Script]({{ site.baseurl }}/assets/images/programming/python_script_2.png)

**Note:** I inserted some "print to console" statements just to see what is happening, but I eventually took them out.

![Verbose screenshot of running the script]({{ site.baseurl }}/assets/images/programming/python_script_3.png)

**After** (see the cleaner file names resulting from the script that ran):

![Results of running the script]({{ site.baseurl }}/assets/images/programming/python_script_4.png)

# Conclusion

It is already challenging to establish a way to keep track of things, including maintaining an inventory of our books. Having a naming system can help. Python scripting can help rename bulk files that have been created by another application.
