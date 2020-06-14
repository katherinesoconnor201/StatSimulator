const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
ctx.canvas.width = window.innerWidth - 100;
ctx.canvas.height = window.innerHeight - 10;

var startTime, endTime;

function start() {
    startTime = performance.now();
};

function end() {
    endTime = performance.now();
    var timeDiff = endTime - startTime; //in ms
    return "Runtime: " + timeDiff / 1000 + " seconds";
}

let fraction = false;
let fract_nums = [];

let category = "Equal To"; // ["Less Than", "Equal To", "Greater Than"]

//Chose ["Less Than", "Equal To", "Greater Than"]
less_than.onclick = function() {
    category = "Less Than";
}

less_than_or_equal.onclick = function() {
    category = "Less Than Equal";
}

equal_to.onclick = function() {
    category = "Equal To";
}

greater_than.onclick = function() {
    category = "Greater Than";
}

greater_than_or_equal.onclick = function() {
    category = "Greater Than Equal";
}

//Calculate probabilities
Calc_Button.onclick = function() {
    start();
    document.getElementById("results").innerHTML = "";
    var user_input = document.getElementById("user_input").value;
    user_input = user_input.toString().split(",");
    if (user_input[3].toString().includes("/")) {
        fraction = true;
        fract_nums = user_input[3].toString().split("/");
        fract_nums = fract_nums.map(Number);
        user_input[3] = fract_nums[0] / fract_nums[1];
    }
    user_input = user_input.map(Number);

    //x, n, s, p
    console.log("Calculating...");
    CalcTheoretical(user_input[1], user_input[3], user_input[0]);
    CalcExperimental(user_input[0], user_input[1], user_input[2], user_input[3]);

    document.getElementById("runtime").innerHTML = end();

}

function CalcTheoretical(n, p, x) {
    let prob = 0;
    if (category == "Greater Than")
        prob = 1 - binomcdf(n, p, x);
    else if (category == "Greater Than Equal")
        prob = 1 - binomcdf(n, p, x - 1);
    else if (category == "Less Than Equal")
        prob = binomcdf(n, p, x);
    else if (category == "Less Than")
        prob = binomcdf(n, p, x - 1);
    else //if (category == "Equal To")
        prob = binompdf(n, p, x);


    document.getElementById("results").innerHTML += "Theoretical Probability: " + prob + "<br>";
}

function CalcExperimental(x, n, s, p) {

    let trial = [];
    let sim = [];
    let success_count = 0;
    let success_rate = 0;
    let num_db = countDecimals(p);

    output = document.createElement("p");
    var str = "";
    var rand;
    for (var r = 0; r < s; r++) { //# of Simulations
        success_count = 0;
        for (var c = 0; c < n; c++) { ///# of Trials
            rand = Math.random();
            if (rand < p) {
                success_count++;
            }
            if (fraction) {
                rand = Math.floor(rand * fract_nums[1]);
            } else {
                rand = Math.floor(rand * Math.pow(10, num_db));
            }
            trial.push(rand);
        }
        /*document.getElementById("results").innerHTML += "<br>";
        document.getElementById("results").innerHTML += trial;*/
        str += "<br>" + trial;
        if (isSuccessful(category, success_count, x)) {
            success_rate++;
            str += " (Success) ";
        }
        // document.getElementById("results").innerHTML += "   (Success)"
        trial = [];
    }
    success_rate = success_rate / s;
    str = "Experimental Probability: " + success_rate + " <br> --------------------------------------- <br> Raw Data: <br>" + str;
    document.getElementById("results").innerHTML += str;
}

var isSuccessful = function(cat, num, x) {
    if (cat == "Greater Than") {
        if (num > x)
            return true;
    } else if (cat == "Greater Than Equal") {
        if (num >= x)
            return true;
    } else if (cat == "Equal To") {
        if (num == x)
            return true;
    } else if (cat == "Less Than Equal") {
        if (num <= x)
            return true;
    } else if (cat == "Less Than") {
        if (num < x)
            return true;
    }
    return false;
}

function binompdf(n, p, x) {
    let q = 1 - p;
    let prob = (factorial(n) / (factorial(x) * factorial(n - x))) * Math.pow(p, x) * Math.pow(q, n - x);
    return prob;
}

function binomcdf(n, p, x) {
    let cum_prob = 0;
    for (let k = 0; k <= x; k++) {
        cum_prob = cum_prob + binompdf(n, p, k);
    }
    return cum_prob;
}

function factorial(x) {
    if (x <= 1) {
        return 1;
    }
    return x * factorial(x - 1);
}

var countDecimals = function(value) {
    if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
    return 0;
}