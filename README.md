

- Go to http://insideairbnb.com/get-the-data . Preferable in Chrome
- Open the browser console
- Paste the Snippet below.
```js
const shows = document.querySelectorAll('.showArchivedData');
shows.forEach( item => {
    item.click();
});
const links = [];
const entries = document.querySelectorAll('.data.table a');
entries.forEach( item => {
    const txt = item.text.trim();
    if(txt === 'listings.csv.gz' || txt === 'reviews.csv.gz' || txt === 'calendar.csv.gz' ){
        links.push(
            item.getAttribute('href')
        )
    }
});
links.sort();
const copy = links.join('\n');
console.log(copy);
```
- Click the "Copy" button shown at the end of the logged lines and replace the content in `links.txt`.