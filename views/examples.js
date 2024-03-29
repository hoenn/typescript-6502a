const programs = [
{
    "name": "Example",
    "source": 
`/*Full Grammar*/
{
    int x
    x =0
    int y
    y= 6 

    while(x != y) {
        print(x)
        x = 1 + x
        if(x == 3) {
            print("fizz")
        }
        if (x==5) {
            print("buzz")
        }

    }
}$
`,
    "type":null
},
{
    "name": "EOP Warning",
    "source":
`/*Missing EOP Warning*/
{
    int x
}
`,
    "type": "warning"
},
{
    "name": "Invalid Token",
    "source": 
`/*Invalid Token Error*/
{
    int y
    y = 3
    print(y * 2)
} $
`,
    "type": "error"
},
{
    "name":"Multiple Programs",
    "source":
`/*Multiple Programs*/
{
    int x
} $ {
    int y
} $
`,
    "type": null
},
{
    "name":"Lex Edge Cases",
    "source":
`/*Lex Edge Cases*/
"a /*b*/ c"
"int x"
int intel
intintel
"ab
`,
    "type": "warning"
},
{
    "name": "Many Lex Examples",
    "source":
`
/*Should pass the lexer with no warnings or errors*/
{1=2}$
{}$
{{{}}}$
{{{}}$
{print("")}$
{print(a)}$
{print(2)}$
{print("a")}$
{print(false)}$
{print("inta")}$
print(a){print(a)}$
{a=1}$
{a = 1}$
{a = 1 + 2 + 3 + 4    +   5}$
{
    int a
    a=a
    string b
    a=b
}$
{int a a=a string b a=b}$
{{a=1+2+3+4+5{print(4+a)}}}$
{
    /*comment*/
    string b
}$
{
    string s
    s="this string is /* in */ visible"
}$


`,
    "type": "null"

},
{
    "name": "Ugly code will Lex",
    "source":
`{intii=0stringss="hello"booleanbb=(true==(1!=2))if(b==true){while(true!=(b!=(false==(2!=3)))){i=1+iprint(s)}}print("ugly code")}$`,
    "type": "null"
},

{
    "name":"Fast Inverse Square Root",
    "source":
`/*Fast Inverse Square Root*/
float Q_rsqrt( float number )
{
	long i;
	float x2, y;
	const float threehalfs = 1.5F;

	x2 = number * 0.5F;
	y  = number;
	i  = * ( long * ) &y;                       // evil floating point bit level hacking
	i  = 0x5f3759df - ( i >> 1 );               // what the f***? 
	y  = * ( float * ) &i;
	y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
//	y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

    return y;
`,
    "type":"error"
}
];
module.exports = {
    programs: programs
}
