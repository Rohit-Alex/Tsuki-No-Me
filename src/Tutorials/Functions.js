/*
    * To create a function we can use a function declaration.
    * This is function declartion/definition 👇
        function fun(parameter1, parameter2) {
            body
        }
    * This is function invocation. 👇
        fun(argument1, argument2)

    * Default parameters are only applied when it has undefined)
*/

function fun() {
  console.log('All my friends are Heathen take it slow')
}

function name(parameter1, parameter2) {
 console.log('Wait for them to ask you who you know' + '\n' + parameter1 + ' ' + parameter2)
}

name('Please dont make any sudden moves', 'You dont know the half of the abuse')

/*
    * Argument name need not be of same name as parameter.
    * The order of arguments has to be in same as we are expecting in parameter.
    * A function can access an outer variable as well
    * The function has full access to the outer variable. It can modify it as well.
    * The outer variable is only used if there’s no local one.
*/

const userName = 'That they loved one day';
function showMessage() {
  const message = 'Welcome to the room of people, ' + userName;
  console.log(message);
}

showMessage();

//Default arguments
function getNiraliSkill(skill = "kanjoos") {
  console.log("Nirali's skill " + skill );
}

getNiraliSkill();


// Also tell her about the length method on functions

// Function Expressions
const tuSetHogi = function() {
  console.log('bhool jaa.')
};

tuSetHogi()

/*
    Difference between Function Declartion and Function Expression
        i> A Function Expression is created when the execution reaches it and is usable only from that moment.
        i> A Function Declaration can be called earlier than it is defined.

        ii> Function declaration is hoisted.
        ii> Function expression is not hoisted.

        iii> Function declaration is defined with function keyword and must have a name.
        iii> Function expression is like creating an anonymous function and storing it in a variable.
*/

// Callback functions
    /*
        * A callback function is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of action.
        * Callback functions are often used in JavaScript to handle asynchronous operations or events.
    */

    /*  
        todo: Why use Callback?
        * Some of our operations are started only after the preceding ones have completed. 
        Often when we request data from other sources, such as an external API, we don’t always know when our data will be served back. 
        In these instances we want to wait for the response, but we don’t always want our entire application grinding to a halt while our data is being fetched. 
        These situations are where callback functions come in handy.

    */
   function forgetBefore(crush, week) {
        console.log(`To forget ${crush} and moveon within ${week} weeks`)
   }

    function bhoolJaaInProgress(name) {
        const someCalc = Math.floor(Math.random() * 5) + 1
        forgetBefore(name, someCalc)
    }

    bhoolJaaInProgress('Nirali')

    // Another example

    function performOperation(num,callback){ 
        setTimeout(() => {
            const randomNumber = Math.floor(Math.random() * 12) + 1 // maan le ye api se aa rha
            callback(num, randomNumber); // aur jab api se aa jaaye tabhi ye function call karna hai
        }, 800)
    }

    function add(num1, num2){
        console.log(num1 + num2);
    }

    function multiply(num1, num2){
        console.log(num1 * num2);
    }

    performOperation(8, add);
    performOperation(8, multiply);

/*
        IIFE
    * Runs as soon as it is defined without being explicitly called.
    * IIFE is often used to create a private scope for the variables and functions defined within it, thus preventing naming conflicts with other code in the global namespace.
    * Hence doesn't pollute global namespace.
*/
(function () {
  // …
})();

(() => {
  // …
})();

(async () => {
  // …
})();