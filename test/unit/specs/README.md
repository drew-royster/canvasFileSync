I found this book to be very useful. I’ve been using many of these ES6 features for quite some time now, but didn’t understand their roots. It’s easier to remember things when you can tie them into a history or a narrative. This book does a great job of explaining how ES6 builds upon ES5 and why some decisions were made which has helped me to remember syntax. 

ES6 was made by building on the work done for ES5 and then responding to common patterns implemented in Node libraries concretizing what the community has made workarounds for. 

Here are some things I have picked up from this.

## Const > Let > Var (almost never var)

Use const unless you absolutely need to reassign the object(immutability reduces bugs) in which case use let, but now that we have ES6 using var is basically unacceptable.

## Use `…` to expand arrays

This applies to arrays you would like to copy or with functions as a way to accept an undefined number of optional parameters.

Copying an array

```
const countries = [ 'France', 'US', 'Canada' ];
const [ ...clonedCountries ] = countries;
```

To use optional parameters 

```
function crazyEquation(operand, divisor, ...rest) {
  const sum = rest.reduce((previous, current) => previous + current, 0);
  return (operand / divisor) + sum;
}
```

## Arrow functions

Look way cleaner and provide much more expected behavior than what we used to have.
```
Let echo = function(value) {
  feturn value
}
```
Can be 
```
let echo = value => value; 
```
This works because if only one value is shown after the `=>` it assumes that you want to return that.

## Destructuring

With this object 
```
let object = {
  Name: ‘blah’,
  Age: 25,
}
```
You can now do this
```
const { name, age } = object;
```
Instead of having to do this
```
const name = object.name;
const age = object.age;
```
If you need to reassign it works like this
```
let name;
let age;
({ name, age } = object);
```
You can can also rename them like this
```
{ name:localName, age: localAge } = object;
```
This also works with arrays, but it obviously just goes off indices
```
const [ first, second, third ] = array;
```
## Asynchronicity
Use Promises they will make your life way better.

We can go from this.
```
getCountry(function(err, country) {
  getState(country, function(err, state) {
    getCity(state, function(err, city) {
      getNeighborhood(city, function(err, neighborhood) {
        getAddress(neighborhood, function(err, address) {
          reportAddress(address, function(e) {
            ...
          });
        });
      });
    });
  });
});
```
To
```
getCountry()
  .then(getState)
  .then(getCity)
  .then(getNeighborhood)
  .then(getAddress)
  .then(reportAddress)
  .then(function(success) {
    console.log(success);
  })
  .catch(function(e) {
    console.error(e);
  })
```
Which is just so much less to write and much cleaner. With ES8 which isn't in the book, but is now broadly supported we can even do this with awaits.

```
try {
  const country = await getCountry();
  const state = await getState(country);
  const city = await getCity(state);
  const neighborhood = await getNeighborhood(city);
  const address = await getAddress(neighborhood);
  const reportStatus = await reportAddress(address);
  console.log(reportStatus);
} catch (err) {
  console.error(err);
}
```

## Broader takeaways

Javascript is completely synchronous and asynchronous behavior only exists because of how we use it. The JS engine is basically a conveyor belt. It just runs jobs in a FIFO queue so all the other wild behavior we can get out of it is completely our doing. The key to understanding asynchronous behavior is just a matter of understanding what lines of code are returning right away and which are returning promises or are expecting callbacks to be passed into them. 