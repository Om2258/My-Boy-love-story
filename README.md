# Birthday Website

Open `index.html` in a browser to view the website.

## Add her photos

1. Put her photos inside `assets/photos`.
2. Rename them like this:
   - `photo1.jpg`
   - photo2.jpg`
   - `photo3.jpg`
   - `photo4.jpg`
   - `photo5.jpg`
   - `photo6.jpg`
3. Open `script.js` and edit the `CONFIG` section at the top:
   - Change `herName`.
   - Change `yourName` if you want to use it in your own message.
   - Change `birthdayDate`.
   - Edit the captions, letter, and wishes.

## Add music

Place your song at:

```text
assets/music.m4a
```

The song starts when she finishes her wish and opens the birthday surprise. The
music button can then pause or play it again.

## Change the unlock pattern

The website now opens with a romantic 3x3 pattern lock.

Edit this line near the top of `script.js`:

```js
unlockPattern: [7, 4, 1, 5, 3, 6, 9],
```

The dots are numbered like this:

```text
1 2 3
4 5 6
7 8 9
```

The current pattern is `7415369`.

## Candle wish page

After the pattern unlocks, the website shows a romantic cake page.

She can click `Blow the candles`, write what she wants most in life, then open
the birthday surprise.

To change the candle page text, edit these lines near the top of `script.js`:

```js
wishGateTitle
wishGateMessage
wishQuestionTitle
wishQuestionText
```

## Change the number of photos

Add or remove items from the `photos` list in `script.js`. Each item needs a `src` and a `caption`.
