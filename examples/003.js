var a = new Array(1);

function f(a) {
    a[0] = new Array(1);
    f(a[0]);
};

f(a);