/*
    * * * * *
    * * * * *
    * * * * *
    * * * * *
    * * * * *
*/

function patternPrint1(n) {
    for (let i = 1; i <= n; i++) {
        let pattern = ''
        for (let j = 1; j <= n; j++) {
            pattern+= '* '
        }
        console.log(pattern)
    }
}

/*
    * 
    * *
    * * *
    * * * *
    * * * * *
*/

function patternPrint2(n) {
    for (let i = 1; i <= n; i++) {
        let pattern = ''
        for (let j = 1; j <= i; j++) {
            pattern+= '* '
        }
        console.log(pattern)
    }
}


/*
    1 
    1 2
    1 2 3
    1 2 3 4
    1 2 3 4 5
*/

function patternPrint3(n) {
    for (let i = 1; i <= n; i++) {
        let pattern = ''
        for (let j = 1; j <= i; j++) {
            pattern+= j + ' '
        }
        console.log(pattern)
    }
}

/*
    1 2 3 4 5
    1 2 3 4
    1 2 3 
    1 2  
    1   
*/

function patternPrint4(n) {
    for (let i = 1; i <= n; i++) {
        let pattern = ''
        for (let j = 1; j <= n+1-i; j++) {
            pattern+= j + ' '
        }
        console.log(pattern)
    }
}


/*
            *                                           _ _ _ _ *
          * *                                           _ _ _ * *
        * * *               ===> equivalent to ====>    _ _ * * *
      * * * *                                           _ * * * *
    * * * * *                                           * * * * *
*/

function patternPrint5(n) {
    for (let i = 1; i <= n; i++) {
        let pattern = ''
        for (let j = 1; j <= n-i; j++) {
            pattern+= '  '
        }
        for (let k = 1; k <= i; k++) {
            pattern+= '* '
        }
        console.log(pattern)
    }
}

patternPrint5(5)


/*
    1 
    1 0
    1 0 1
    1 0 1 0
    1 0 1 0 1
*/

function patternPrint6(n) {
    for (let i = 1; i <= n; i++) {
        let pattern = ''
        for (let j = 1; j <= i; j++) {
            if (j % 2 === 0) {
                pattern+= '0 '
            } else {
                pattern+= '1 '
            }
        }
        console.log(pattern)
    }
}

patternPrint6(5)


/*
    1 
    0 1
    0 1 0
    1 0 1 0
    1 0 1 0 1
*/

function patternPrint7(n) {
    let character = '1'
    for (let i=1; i <= n; i++) {
        let pattern = ''
        for (let j = 1; j <= i; j++) {
            pattern+= character + ' '
            character = character === '1' ? '0' : '1'
        }
        console.log(pattern)
    }
}

patternPrint7(5)
