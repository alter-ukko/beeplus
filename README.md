## bee+

Bee+ is a word game, similar to the New York Times' [Spelling Bee](https://www.nytimes.com/puzzles/spelling-bee). Instead of a single tableau of letters, there are seven stages. A real version of the game is hosted at [beepl.us](https://beepl.us).

The goal is to make the longest pangram possible in each stage. The game gives you four letters to start with, then adds a letter in each successive stage until there are seven letters. After that, the game _removes_ one letter in each successive stage until you're back to four letters.

Your score is the combined length of all the words you've made, and a "perfect" score is the highest score possible based on the game's "accepted" word list.

### Running

The game is written in Javascript, and there are only three source files. To run the game yourself, you'll need to serve it with a web server and provide data files in the `beeplus` subdirectory. The first file you'll need is the accepted word list. It should be called `beeplus_words.json`. Its format is:

```json
{
	"AARGH": 1,
	"ABACI": 1,
	"ABACK": 1,
	"ABAFT": 1,
	"ABALONE": 1,
	"ABANDON": 1,
	"ABANDONED": 1,
	"ABANDONING": 1
}
```

Notice that it's a map. This just makes it easy to look up whether an entered word is "correct" without pre-processing the file.

Each day's puzzle has its own JSON file, with the name in `beeplus_YYYY_MM_DD.json` format. A puzzle looks like this:

```json
{
    "start":
    [
        "C",
        "I",
        "R",
        "T"
    ],
    "add":
    [
        "Y",
        "P",
        "A"
    ],
    "remove":
    [
        "C",
        "T",
        "I"
    ],
    "best":
    [
        6,
        6,
        7,
        8,
        6,
        6,
        5
    ]
}
```

The `start` element contains the four letters the player starts with in stage 1. The `add` element contains the list of letters the game will add in stages 2, 3 and 4, in order. The `remove` section contains the list of letters the game will remove in stages 5, 6, and 7, in order. It's customary for the `remove` letters to come from the set of letters in the `start` section, although there's nothing that prohibits doing things differently. The `best` section is a list of the best possible word lengths for each stage, in order. These should be pre-computed from your actual word list, or you will have some angry players.

### Notes

This game uses the amazing [Vanilla.js framework](http://vanilla-js.com/). It contains no user tracking in the secretly-send-info-to-the-server sense, and tracks all user progress and game completion in browser local storage. The code is probably not super great in the traditional sense because I did things in an intentionally simple way.

The main reason I coded this was to create a word game that I could automatically generate and play myself along with my spouse without knowing the answers in advance.
