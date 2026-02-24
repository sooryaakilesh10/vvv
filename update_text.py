import sys

with open('src/index.jsx', 'r') as f:
    text = f.read()

def repl(old, new):
    global text
    if old in text:
        text = text.replace(old, new)
    else:
        print(f"Warning: could not find {repr(old)}")

repl('const HER_NAME = "Babe"; // ← change this to her real name! // ← change this', 'const HER_NAME = "Vinaya";')
repl('const WORDS = ["annoying", "always hungry", "loud", "stealing my hoodies"];', 'const WORDS = ["my favorite chat buddy", "my \'online friend\'", "the \'night owl\'", "friend-zoning me"];')
repl('"the ultimate boyfriend appreciation post"', '"the ultimate attempt to impress you"')
repl('"A heavily biased presentation on why I tolerate you. (Move your finger!)"', '"A heavily biased presentation on why you should give this \'kiddo\' a chance. (Move your finger!)"')
repl('{done ? <em>Still annoying though.</em> : "Reveal the menace"}', '{done ? <em>Still totally worth the effort.</em> : "Reveal the one I\'m trying to impress"}')
repl('Drag right to reveal the person always eating my snacks', 'Drag right to reveal the one who just wants to be \'online friends\'')
repl('"how did I end up here?"', '"how did a 22-year-old end up here?"')
repl('"Scratch for the ugly truth"', '"Scratch to read my mind"')
repl('"100% Certified Menace"', '"100% Certified Special Person"')
repl('"You are<br />a lot of work."', '"You are<br />worth<br />the effort."')
repl('"Science has confirmed you are the reason I am always broke."', '"Science has confirmed age is just a number."')
repl('"Tap each tile to find the problem"', '"Tap each tile to reveal her"')
repl('"There is the troublemaker."', '"There she is, in all her glory."')
repl('"I still question my life choices every single time."', '"Still rejecting my proposals, I see."')
repl('label: "hangry"', 'label: "friend-zoning"')
repl('label: "bossy"', 'label: "independent"')
repl('label: "sleepy"', 'label: "scared"')
repl('"Wow, you did something right."', '"Wow, maybe I\'m not just a kiddo."')
repl('"I am definitely the catch in this relationship."', '"See? We make a great match."')
repl('"refusing to pick a restaurant"', '"friend-zoning me at 9 PM"')
repl('"explaining why you need another iced coffee"', '"trying to hide that you actually like me"')
repl('"falling asleep 5 mins into a movie"', '"telling me \'I\'m just a kiddo\'"')
repl('"Every angle is your weirdest angle"', '"Every angle is your best angle"')
repl('"Swipe to agree to my terms"', '"Swipe to agree to a real date"')
repl('"Sigh... okay."', '"Finally!"')
repl('"I guess I am okay with keeping you around."', '"I guess I\'m okay with going on a date with a 22-year-old."')

repl('''  const SCENES = [
    { q: "Will you ever decide what to eat?", a: "No, you have to guess.", img: PHOTOS[4] },
    { q: "Who is the better driver?", a: "Me, obviously.", img: PHOTOS[5] },
    { q: "Are you going to steal my fries after saying you were not hungry?", a: "Yes. 100%.", img: PHOTOS[0] },
    { q: "Will you admit I was right about that one thing?", a: "Literally never.", img: PHOTOS[1] },
    { q: "Are my jokes actually funny?", a: "I only laugh out of pity.", img: PHOTOS[2] },
    { q: "Are you stuck with me forever?", a: "Unfortunate, but yes.", img: PHOTOS[3] },
  ];''', '''  const SCENES = [
    { q: "Am I just an online friend?", a: "No, you're much more.", img: PHOTOS[4] },
    { q: "Are we going out to Fun Mall?", a: "Yes, my treat.", img: PHOTOS[5] },
    { q: "Will you stop using my age against me?", a: "Yes. 100%.", img: PHOTOS[0] },
    { q: "Did I impress you with this website?", a: "Obviously.", img: PHOTOS[1] },
    { q: "Can we stop the 'just friends' act?", a: "Yes, I yield.", img: PHOTOS[2] },
    { q: "Will you finally say yes?", a: "Maybe...", img: PHOTOS[3] },
  ];''')

repl('''  const PROMISES = [
    { t: "I get the TV remote for a week", c: "#b8936a" },
    { t: "You admit I am the funny one", c: "#a8687a" },
    { t: "You buy ME dinner for once", c: "#8c9aaa" },
    { t: "I win the next argument automatically", c: "#9a7860" },
    { t: "You have to carry the groceries", c: "#b8936a" },
    { t: "I get to sleep on the middle of the bed", c: "#a8687a" },
    { t: "You stop stealing my t-shirts", c: "#8c9aaa" },
    { t: "Spin again, loser", c: "#9a7860" },
  ];''', '''  const PROMISES = [
    { t: "You accept my proposal", c: "#b8936a" },
    { t: "We go on a real date", c: "#a8687a" },
    { t: "No more 'online friends' talk", c: "#8c9aaa" },
    { t: "You admit I'm not just a kiddo", c: "#9a7860" },
    { t: "A walk in the park", c: "#b8936a" },
    { t: "You stop rejecting me", c: "#a8687a" },
    { t: "We hit off well", c: "#8c9aaa" },
    { t: "Spin again, madam", c: "#9a7860" },
  ];''')

repl('"Spin for a real promise"', '"Spin for a real date promise"')

repl('''  const POEM = [
    { t: "Look, I am not good at this feelings stuff,", c: "#b8936a" },
    { t: "But I guess you are alright.", c: "#ede8e0" },
    { t: "You are annoying, bossy, and always hungry,", c: "#a8687a" },
    { t: "But somehow I still like you.", c: "#8c9aaa" },
    { t: "You might be a menace to society,", c: "#b8936a" },
    { t: "But you are MY menace.", c: "#ede8e0" },
    { t: "So stop stealing my hoodies,", c: "#a8687a" },
    { t: "Start deciding where we eat,", c: "#8c9aaa" },
    { t: "And never change.", c: "#b8936a" },
    { t: "Because you are my favorite.", c: "#f0e8dc" },
  ];''', '''  const POEM = [
    { t: "Look, I know I am younger,", c: "#b8936a" },
    { t: "And you just want to be 'free',", c: "#ede8e0" },
    { t: "But I am not giving up easily,", c: "#a8687a" },
    { t: "Because I see something special.", c: "#8c9aaa" },
    { t: "You might friend-zone me every day,", c: "#b8936a" },
    { t: "But I still want to earn your liking.", c: "#ede8e0" },
    { t: "So stop calling me a kiddo,", c: "#a8687a" },
    { t: "Take a chance on this software engineer,", c: "#8c9aaa" },
    { t: "And let's go on a proper date.", c: "#b8936a" },
    { t: "Because I really value you.", c: "#f0e8dc" },
  ];''')

repl('''  const LINES = [
    "Another day of me successfully putting up with you.",
    "Another year, still have not dumped you.",
    "Are you ever going to grow up?",
    "I would have more money without you.",
    "You are welcome for my presence.",
  ];''', '''  const LINES = [
    "Another day of me trying to get you to say yes.",
    "Age is just a number, remember?",
    "Stop pushing me away.",
    "I'm not doing this just as a coping mechanism.",
    "You are someone I don't want to lose.",
  ];''')

repl('Ur Aight.', '"Say Yes?"')

repl('''  const CLOSING = [
    ["Look, I complain a lot...", "#b8936a"],
    ["And you are definitely a handful...", "#ede8e0"],
    ["But I probably would not trade you for anything.", "#a8687a"],
    ["Maybe for a million dollars. Maybe. But probably not.", "#8c9aaa"],
  ];''', '''  const CLOSING = [
    ["Look, I know you are scared of the age difference...", "#b8936a"],
    ["And you keep saying you just want an online friend...", "#ede8e0"],
    ["But I don't want to miss a person I could be happiest with.", "#a8687a"],
    ["So please, stop making excuses.", "#8c9aaa"],
  ];''')

repl('''  const PARAS = [
    "If you are reading this, congrats on making it through my very nerdy, highly sarcastic website without getting mad.",
    "I just wanted an excuse to roast you a bit and remind you that despite all the hoodie-stealing and indecisiveness, you are my favorite.",
    "I love all our inside jokes, our late night talks, and every random stupid thing we do together.",
    "I am so excited for everything that comes next for us. Whatever it is, as long as we are a team, I know it is going to be amazing.",
    "This is just a digital love letter to say: you are the best girlfriend a guy could ever ask for.",
  ];''', '''  const PARAS = [
    "If you are reading this, congrats on making it through my very nerdy, highly sarcastic website to impress you without getting mad.",
    "I just wanted an excuse to show you how much I care, and to remind you that despite the age difference and your fears, I really like you.",
    "I love our late night chats, your sarcasm, and the fact that you're an amazing vegetarian.",
    "I want to earn your liking. I'm not just asking you to fix my hardships. I just want to cover your back.",
    "This is just a digital love letter to say: please don't just be my online friend. Let's make this real. - Soorya",
  ];''')

repl('you are so needy', 'you are so special')

with open('src/index.jsx', 'w') as f:
    f.write(text)
