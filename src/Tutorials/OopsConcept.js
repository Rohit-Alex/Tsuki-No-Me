const helperObj = {
    xyz: {
        pickupLine: "Do you come with a price tag, 'cause I want to invest in you!",
        afterMarraigeSchedule: `Shopping: Once a week. \n Dinner: Twice a week. \n Movie: Twice a month`
    },
    abc: {
        pickupLine: "Are you a plane ticket? Cause you take my breath away!",
        afterMarraigeSchedule: `Ticket hum khood karwaa lenge.`
    },
    yenAreEye: {
        pickupLine: "Chalna hai toh chal, warna bahut padi hai line mein!",
        afterMarraigeSchedule: "Time pe khaana mil jaayega"
    }
}

/*
    Suppose we want to store details of all the groom's that are approaching you for the marraige.
    Every groom gonna have some properties like
        i> name
        ii> age
        iii> hobbies
        iv> height
        v> occupation
        vi> salary
        vii> getIntro()
        viii> getProposeLine() 
        ix> getAfterMarraigeSchedule()
    
    So what we can do here is create objects for each groom and store his details like.
*/

const groom1 = {
    name: 'xyz',
    age: 24,
    hobbies: 'Playing games,watching Anime, and music',
    height: "5'10 feet",
    occupation: 'SDE1',
    salary: 2400000,
    getIntro() {
        return `Meet ${this.name}, a ${this.age}-year-old ${this.occupation} who stands tall at ${this.height}.\n I like ${this.hobbies} `
    },
    getPickupLine() {
        return "Do you come with a price tag, 'cause I want to invest in you!"
    },
    getAfterMarraigeSchedule() {
        return `Shopping: Once a week. \n Dinner: Twice a week. \n Movie: Twice a month`
    }
}

const groom2 = {
    name: 'abc',
    age: 25,
    hobbies: 'To be with you',
    height: "5'8 feet",
    occupation: 'Businessman',
    salary: 4000000,
    getIntro() {
        return `Meet ${this.name}, a ${this.age}-year-old ${this.occupation} who stands tall at ${this.height}.\n I like ${this.hobbies} `
    },
    getPickupLine() {
        return "Are you a plane ticket? Cause you take my breath away!"
    },
    getAfterMarraigeSchedule() {
        return `Ticket hum khood karwaa lenge.`
    }
}

/*
        !   The Problem and Solution

    Now unlike other girls, tumhare number already 30 cross kar chuka hai even without actively looking for shaadi.
    Toh It's quite un-scalable and hectic to maintain record for that number of records. 
    Secondly there is lot of code repetition and redundancy.

    * Here, we need to create many objects of same kind, like grooms.
    You might think of using constructor function (new Function) for this.
    ? Solution to use "Constructor Function" or "Classes"
    But in the modern JavaScript, there’s a more advanced “class” construct, that introduces great new features which are useful for object-oriented programming.
*/

/*
    ! Constructor Function vs Classes.

    *  Blueprint to create objects with predefined properties and methods. 
    *  By creating a class, we can later on instantiate (create) objects from that class, 
    *       that will inherit all the properties and methods that class has.
    *  Syntactical sugar (easier to read and understand) which some advance and new features that supports OOPs.
*/

/*
    ! Solution using constructor function
*/

function groom(name, age, hobbies, height, occupation, salary) {
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
    this.height = height;
    this.occupation = occupation;
    this.salary = salary;
    this.getIntro = function() {
        return `Meet ${this.name}, a ${this.age}-year-old ${this.occupation} who stands tall at ${this.height}.\n I like ${this.hobbies} `
    }
    this.getPickupLine = function() {
        return helperObj[this.name].pickupLine
    }
    this.getAfterMarraigeSchedule = function() {
        return helperObj[this.name].afterMarraigeSchedule
    }
}

/*
    ! Solution using Classes
*/


class Groom {
    constructor(name, age, hobbies, height, occupation, salary) {
        this.name = name;
        this.age = age;
        this.hobbies = hobbies;
        this.height = height;
        this.occupation = occupation;
        this.salary = salary;
    }
    getIntro() {
        return `Meet ${this.name}, a ${this.age}-year-old ${this.occupation} who stands tall at ${this.height}.\n I like ${this.hobbies} `
    }
    getPickupLine() {
        return helperObj[this.name].pickupLine
    }
    getAfterMarraigeSchedule() {
        return helperObj[this.name].afterMarraigeSchedule
    }
}

const groom3 = new Groom('xyz', 24,'Playing games,watching Anime, and music', "5'10 feet", 'SDE1', 2400000)
const groom4 = new Groom('abc', 25,'To be with you', "5'8 feet", 'Businessman', 4000000)

console.log(groom3.getPickupLine())
console.log(groom3.getAfterMarraigeSchedule())
console.log(groom4.getPickupLine())
console.log(groom4.getAfterMarraigeSchedule())

/*
    ! Class fields vs Constructor variables

    i> Class fields are properties that are defined directly on the class, outside of any methods or the constructor function. 
    They can be declared using the new static keyword or without it. Class fields are shared among all instances of the class and can be accessed and modified using the class itself or any instance of the class.

    Constructor variables are values declared inside the constructor function, on the other hand, are instance properties that are unique to each instance of the class. 
    They are defined using the this keyword inside the constructor function and are not shared among instances.

    ii> The important difference of class fields is that they are set on individual objects, not User.prototype:

    e.g. Add class field 👇 at line 95
        bride = 'Amane' // Note: Can't write const bride = 'Amane'


*/

/*
    ! Static Methods

    Note: Once the class field or method is declared static, it is no longer associated with the objects and is directly linked to Class.
          If tried to access:
            i> class field by any instance of class (object) => gives undefined
            ii> method by any instance of class (object) => thow not a function error
    ? Groom.getAfterMarraigeSchedule() // This doesn't work. As all the methods are assigned to the objects.

    To make a method accessible to the class as a whole instead of the objects created from class, we can make a method static.

    static staticMethod() {
        console.log("OOPs in JS!");
    }

    * Groom.staticMethod() // This works
*/

/*
    ! Inheritance.

    Ab tu koi aisi waisi toh hai nhi. Tumhare liye ladko ka number laga hua hai. Tumhare liye NRI ka bhi rista aata hai.
    Therefore, a NRI groom would be having all the properties that are given above and apart from that he would have
        countryVisa
        getStayPeriod()
*/

class AdvanceGroom extends Groom {
    constructor(name, age, hobbies, height, occupation, salary, countryVisa) {
        super(name, age, hobbies,  height, occupation, salary)
        this.countryVisa = countryVisa
    }
    getStayPeriod() {
        return `${this.countryVisa} return and I can stay a max of 14 days in India`
    }
}

const nriGroom = new AdvanceGroom('yenAreEye', 29, 'Taadna', "5'8 feet", 'Majdoori', 1500000, 'Germany')

console.log(nriGroom.getIntro())
console.log(nriGroom.getPickupLine())
console.log(nriGroom.getAfterMarraigeSchedule())
console.log(nriGroom.getStayPeriod())

/*
    ! Overriding, Encapsulation (Private and Protected), Abstraction and Polymorphism

    Suppose, tumhara NRI waala ladka ko apna kuch alag Intro dena hai toh wo override kar sakta hai.

    Add this method.
    getIntro() {
        return `My naam Chomu hai. Me coming to shaadi with you. Tum earning and me eating. Okay & done.`
    }

    !Encapsulation
    It stands for an object's capacity to "decide" which information it exposes to "the outside" and which it doesn't. 
    Encapsulation is implemented through public and private properties and methods.

    * e.g Make bride private so that any outsider is not able to view it.

    !Polymorphism

    Same function behaving differently under different conditions

    !Abstraction
    Representing only the essential features without including the background details. 
    
    * e.g. Tumko bus baaki ka dil todne aata baaki phir dusra ko kya ho usse fark nhi padta.
    * Humlog ko khaane se matlab hai baaki ka process se matlab nhi ki kaise wo mouth se hoke windpipe of escape kar ke stomatch mein jaake phir kaise digest ho

*/


// private declarations
class Rectangle {
    #height = 0;
    #width;
    constructor(height, width) {
        this.#height = height;
        this.#width = width;
    }
}