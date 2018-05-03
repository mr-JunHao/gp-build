require('babel-polyfill');
// import 'babel-polyfill';
[1,2,2].map(val=>{
    console.log(val)
})
let obj = { a: 1, b: 2, c: 3 };

for (let [key, value] of Object.entries(obj)) {
    console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
}

