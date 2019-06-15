// tuples
const address: [string, number] = ['stuff', 99];

// as const
const arr = ['a', 'b'] as const;

enum Color {
  Blue,
  Green = 100,
  Red = 2,
}

// encode numbers into more user-friendly values to be used during coding
const myColor: Color = Color.Red;

// functions
type MyMultiply = (num1: number, num2: number) => number;
const myMultiply: MyMultiply = (num1: number, num2: number) => num1 * num2;

const obj = {};
// not allowed since no explicit type, implicit type is restricted to what obj is
// obj.fun = true;

interface UserData {
  // index signature allows other props to be added
  [index: string]: string | number;
  name: string;
  age: number;
}
// objects
const userData: UserData = {
  age: 44,
  name: 'Jason',
};
// allowed b/c UserData type allows for string propName with value that is string or number
userData.greeting = 'hi';

// never - not void b/c it doesn't not return anything
const neverReturns = (): never => {
  throw new Error('An error!');
};

// nullable types
// adding strictNullChecks: true in tsconfig fixes disallows null unless specified in type
let canBeNull: number | null = 12;
canBeNull = null;

console.log('hi');

interface NamedPerson {
  firstName: string;
}

const greet = (namedPerson: NamedPerson): void => {
  console.log(`Hello, ${namedPerson.firstName}`);
};

const person = {
  age: 44,
  firstName: 'Jason',
};

// this works even though "age" is not a prop in NamedPerson
greet(person);
// passing an object literal directly causes a stricter check from TS
// so this does not work
// greet({ firstName: 'Jason', age: 44 });

type Meow = () => void;

interface NamedCat {
  name: string;
  [index: string]: string | number | string[] | Meow;
}

const pet = (namedCat: NamedCat): void => {
  console.log(`I am petting ${namedCat.name}`);
};

const meow: Meow = (): void => {
  console.log('Meow');
};

const butter = {
  age: 1,
  hobbies: ['eating'],
  meow,
  name: 'Butter',
};

// this works b/c the interface has an index signature
pet({ name: 'Butter', age: 1, hobbies: ['eating'], meow });
pet(butter);

interface AgedPerson extends NamedPerson {
  age: number;
}

const personWithAge: AgedPerson = {
  age: 44,
  firstName: 'Jason',
};

// Generics
const betterEcho = <T>(data: T) => data;
// ts understands that return value is related to input
// and disallows certain actions b/c of that
// console.log(betterEcho(7).length);
// doesn't work b/c type of generic is explicitly set & arg doesn't match
// console.log(betterEcho<string>(7).length);

// built-in generics
const testResults: number[] = [1, 2, 3];
// doesn't work b/c 'hi' is not a number
// testResults.push('hi');

// array type in generic
const printEach = <T>(args: T[]) => {
  args.forEach((arg) => {
    console.log(arg);
  });
};
printEach<string>(['hi', 'there', 'you']);

// Generic Types
const echo2: <T extends string | number>(data: T) => T = betterEcho;
console.log(echo2<string>('hi')); // logs hi
console.log(echo2(7)); // logs 7
// console.log(echo2(true)); --> won't work b/c true is neither string or number

// each type should be set separately
const log2Values = <T extends number | string, U extends boolean | string>(a: T, b: U): void => {
  console.log(a);
  console.log(b);
};
log2Values(7, true);
// log2Values(7, 7); // doesn't work

// OR one type can extend another
const log2MostlySimilarValues = <T extends U | boolean, U extends number | string>(a: T, b: U): void => {
  // this would also work
  // const log2SimilarValues = <T extends number | string>(a: T, b: T): void => {
  console.log(a);
  console.log(b);
};
log2MostlySimilarValues('a', 'a');
log2MostlySimilarValues<boolean, number>(true, 7);
// log2SimilarValues(7, true); // will not work b/c second arg must be str or num

// Union type allows variable to be multiple types
type A = string | number;
const a1: A = 5;
const a2: A = '5';

// Intersection type is where you take multiple objects & create a new one that
// that has the features of all of those objects
interface C {
  a: string;
}

interface D {
  d: number;
}

interface E extends C, D {
  e: boolean;
}

const eObj: E = {
  a: 'a',
  d: 1,
  e: true,
};

// Tuple type -  array with specified members
type F = [string];
const f: F = ['hi'];
// const f2: F = ['hi', 'you']; // doesn't work

type G = [string, number];
const g: G = ['hi', 1];

interface H {
  a: number;
  b: number;
}

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// to extend and override type:
interface I extends Omit<H, 'a'> {
  a: string;
}

const i: I = {
  a: 'hi',
  b: 2,
};

interface TopBottomLeftRight {
  bottom: number;
  left: number;
  right: number;
  top: number;
}
// Overloads

// for function declarations
function padding(allOrTopAndBottom: number, leftAndRight?: number): TopBottomLeftRight;
function padding(top: number, bottom: number, left: number, right: number): TopBottomLeftRight;
// Actual implementation that represents all cases of func body
function padding(a: number, b?: number, c?: number, d?: number): TopBottomLeftRight {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    // type assertion made b/c param could be undefined
    bottom: c as number,
    left: d as number,
    right: b as number,
    top: a,
  };
}

// for function expressions
const padding2: {
  (allOrTopAndBottom: number, leftAndRight?: number): TopBottomLeftRight;
  (top: number, bottom: number, left: number, right: number): TopBottomLeftRight;
} = (a: number, b?: number, c?: number, d?: number): TopBottomLeftRight => {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    // type assertion made b/c param could be undefined
    bottom: c as number,
    left: d as number,
    right: b as number,
    top: a,
  };
};

// OR
// an interface can provide multiple callable annotations to specify function overloading
interface Padding {
  (allOrTopAndBottom: number, leftAndRight?: number): TopBottomLeftRight;
  (top: number, bottom: number, left: number, right: number): TopBottomLeftRight;
}
const padding3: Padding = (a: number, b?: number, c?: number, d?: number): TopBottomLeftRight => {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    // type assertion made b/c param could be undefined
    bottom: c as number,
    left: d as number,
    right: b as number,
    top: a,
  };
};

// Type Guard - typeof or instanceof can be used to narrow type
const doSomething = (numOrStr: number | string): void => {
  // TypeScript knows that x must be a string
  if (typeof numOrStr === 'string') {
    console.log(numOrStr.substr(1));
  } else if (typeof numOrStr === 'number') {
    // this could also be else
    // } else {
    console.log(numOrStr + numOrStr);
    // this won't work b/c there is no substr method available to numbers
    // console.log(x.substr(1));
  }
  // this also won't work b/c there is no substr method available to numbers
  // console.log(x.substr(1));
};

interface AObj {
  a: 'apples';
  c: boolean;
}

interface DObj {
  x: 'oranges';
  [index: string]: string;
}

interface BObj {
  b: number;
  c: boolean;
  d: DObj;
}

const objHasOranges = (object: AObj | BObj) => {
  if ('d' in object) {
    // literal type guard
    return object.d.x === 'oranges';
  }

  return false;
};

const capitalize = (str: string) => `${str[0].toUpperCase()}${str.slice(1)}`;
const doStuff = (aOrBObj: AObj | BObj) => {
  if ('a' in aOrBObj) {
    console.log(`How about them ${aOrBObj.a}?`);
  }

  if ('b' in aOrBObj) {
    console.log(aOrBObj.b.toFixed());

    if (objHasOranges(aOrBObj)) {
      console.log(`${capitalize(aOrBObj.d.x).slice(0, -1)} you glad?`);
    }
  } else {
    console.log('Orange you disappointed?');
  }

  // c is a boolean prop on both
  console.log(aOrBObj.c.valueOf());
};

const bObj: BObj = {
  b: 1,
  c: true,
  d: {
    x: 'oranges',
  },
};

const aObj: AObj = {
  a: 'apples',
  c: false,
};
console.log('\nBObj type:');
doStuff(bObj);
console.log('\nAObj type:');
doStuff(aObj);

// Inference
const iTakeFoo = (foo: 'foo') => foo;
const objWithSomeProp = {
  // necessary for this to work b/c someProp is just any string otherwise
  someProp: 'foo' as 'foo',
};
// OR
interface HasFoo {
  [key: string]: 'foo';
}
const objWithAnotherProp: HasFoo = {
  anotherProp: 'foo',
};
iTakeFoo(objWithSomeProp.someProp);
iTakeFoo(objWithAnotherProp.anotherProp);

// string-based enums
/** Utility function to create a K:V from a list of strings */
const strEnum = <T extends string>(o: T[]): { [K in T]: K } =>
  o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));

/** create a K:V
 * result is:
 * {
 *   north: 'north',
 *   south: 'south',
 *   ...
 * }
 */
const Direction = strEnum(['north', 'south', 'east', 'west']);

/** Create a Type */
type Direction = keyof typeof Direction;
/** sample using a string enum */
let sample: Direction;
sample = Direction.north;
sample = 'north';
// this won't work
// sample = 'something else';

// readonly
interface ConfigWithReadOnlyProps {
  readonly bar: string;
  readonly baz: number;
}

interface Config {
  [index: string]: any;
}
// could do Readonly<Config>
interface ReadonlyConfig {
  readonly [index: string]: any;
}

type ReadOnlyConfig = ReadonlyConfig;
const config: ReadOnlyConfig = {
  b: 8,
  o: {
    fudge: 'is brown, usually',
  },
  x: 'hello',
  z: ['fun', 'time'],
};
// won't work b/c props are readonly
// config.b = 9;
console.log(config);

/** Type Inference
 * 3 simple rules:
 * 1. types of vars are inferred by definition:
 * ```js
 * const foo = 123; // type is number
 * const bar = 'hello'; // type is string
 * ```
 * 2. return type of a func is inferred by return statement
 * ```js
 * const add = (a: number, b: number) => a + b; // type is number
 * ```
 * 3. types can be inferred by assignment
 * ```js
 * type Adder = (a: number, b: number) => number;
 * const foo: Adder = (a, b) => a + b; // type is number
 * ```
 * Structuring
 * TS objects are structurally typed, which means that names don't matter
 * as long as the structures match, which allows object to be created on
 * the fly without explicit typing but also without sacrificing safety
 * ```js
 * const foo = {
 *   a: 123,
 *   b: 456,
 * }; // type is inferred to be { a: number, b: number }
 * const bar = [1, 2, 3]; // type is inferred to be number[]
 * bar.push(5); // works b/c more data is fine as long as type matches
 * bar.push('a'); // does not work
 * ```
 * Destructuring
 * ```js
 * const foo = {
 *   a: 123,
 *   b: 456,
 * };
 * let { a } = foo;
 * a = 'hello'; // would not work
 * const bar = [1, 2];
 * let [a, b] = bar;
 * a = 'hello'; // would not work
 * ```
 */

/** Functions */
type CoolFunc = () => { a: 0; b: 'hi' };
const myCoolFunc1: CoolFunc = () => ({ a: 0, b: 'hi' });
/** ok b/c return type must contain at least enough data but can contain more */
const myCoolFunc2: CoolFunc = () => ({ a: 0, b: 'hi', c: 'extra' });

/** ok to pass fewer args */
type ITakeSomethingAndPassItAnErr = (x: (err: Error, data: any) => void) => void;
/** this works */
const iTakeSomethingAndPassItAnErr1 = (err: Error) => {
  console.log(err);
};
/** this works, too */
const iTakeSomethingAndPassItAnErr2 = () => {
  console.log('nothing to see here');
};
/** so does this works */
const iTakeSomethingAndPassItAnErr3 = (err: Error, data: string) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
};

/** Never
 * 1. a function that never returns (ex. infinite loop)
 * 2. a function always throws
 * different from void in that void returns nothing while never never returns
 */

/**
 *  index signature
 */
interface HasIndexSig {
  [index: string]: number;
}

/** using Mapped Types, index can be union of literal strings */
type SpecificKeys = 'firstName' | 'lastName';
/** Mapped Types */
type FromSpecificKeys = { [k in SpecificKeys]?: string };
const firstAndLastName1: FromSpecificKeys = {
  firstName: 'Jason',
  lastName: 'Overby',
  // cat: 'butter', <-- not ok b/c not in Mapped Types
};
/** ? allows for fewer props so this is ok, too */
const firstAndLastName2: FromSpecificKeys = {
  firstName: 'Jason',
};

type Cool = 'cool';
type Uncool = 'uncool';
let result: Cool | Uncool;

const getCool = () => {
  result = 'cool';
  /** not sure where you would use this, but typeof can be used to
   * ensure a type matches
   */
  let coolness: typeof result;
  coolness = 'cool';
  return coolness;
};

/** works b/c type if same as result */
const coolStatus: Cool = getCool();
/** does not work b/c types are incompatible */
// const coolStatus: Uncool = getCool();

const colors = {
  blue: 'blue',
  red: 'red',
};
/** keyof is TS keyword */
type Colors = keyof typeof colors;
let color: Colors; // same as using string literal type 'red' | 'blue'
color = 'red';
// color = 'yellow'; // does not work

/**
 * unknown
 * if the type is truly unknown for some reason,
 * it's better to type it with unknown than any
 * comparison operators are ok but not operators
 * specific to a particular type
 */
const aVar: unknown = config;
const bVar = aVar === 123;
// const c = a + 10; // not ok b/c a may not be a number

/**
 * Intersection
 * combines multiple types into one type
 * must contain ALL props and ONLY those props from one type AND(&) another
 */
interface Name {
  name: string;
  nickname: string;
}
interface Age {
  age: number;
  ageInDogYears: number;
}
const DOG_YEAR_CONVERSION = 7;

type NameAndAge = Name & Age;
const rusty: NameAndAge = {
  // must have age, ageInDogYears, name, and nickname and no other props
  age: 5,
  ageInDogYears: 5 * DOG_YEAR_CONVERSION,
  // cool: true, // <-- doesn't work b/c this prop is not on either type
  name: 'Rusty',
  nickname: 'Ironsides',
};

/**
 * Union
 * value can be one of several types
 * must contain ALL props of one type OR(|) another
 * but can contain props of both types
 */

type NameOrAgeOrBoth = Name | Age;
const spuds: NameOrAgeOrBoth = {
  /**
   * it works to have ONLY props of Name OR Age
   * or all props of one and some props of the other
   * but does not work if contain some (not all) props from Name
   * and some (not all) from Age
   */
  // age: '2', // doesn't work because, though it is a known property, the type is mismatched
  // ageInDogYears: 2 * DOG_YEAR_CONVERSION, // does not need this prop but can have it
  // cool: true, // <-- doesn't work b/c this prop is not on either type
  name: 'Spuds', // must have this prop
  nickname: 'Bud', // and this prop
  // nickname: 1, // this would not work
};

let strOrNumArr: Array<string | number> = ['hello', 'my', 'friend'];
strOrNumArr = ['hello', 'my', 3]; // can contain either type
strOrNumArr = [1, 2, 3];
// strOrNumArr = [1, 2, false]; // does not work
let numArrOrStrArr: string[] | number[] = ['hello', 'my', 'friend'];
numArrOrStrArr = [1, 2, 3];
// numArrOrStrArr = ['hello', 'my', 3]; // does not work
interface AObj2 {
  a: string;
}
interface BObj2 {
  b: number;
  c: boolean;
}
type OtherStuffType = AObj2 | BObj2;
const otherStuff1: OtherStuffType = {
  // a: false, // doesn't work b/c type is wrong
  a: 'hello',
  b: 1,
  // b: '2', // doesn't work
  c: true,
  // d: 2, // doesn't work
};
const otherStuff2: OtherStuffType = {
  a: 'hello',
  // b: '2', // does not works b/c though type is wrong
};
const otherStuff3: BObj2 = {
  b: 2,
  c: false,
};

interface Z {
  num: number;
}
const y = {
  num: 1,
} as const;
// y.num = 3; // this fails
const z: Z = {
  num: 1,
} as const;
z.num = 3; // this does not fail

/**
 * Tuples
 * type of a fixed number of elements is known
 */
// ideal to designate as readonly
type Tup = readonly [number];
const tup: Tup = [1];
// tup[0] = 2; // does not work
// tup.push(2); // does not work
console.log(tup);

// let type be inferred but add as const
const tup2 = [1, 2] as const;
// tup2.push(3); // does not work
// tup2[0] = 0; // does not work

const x: [string, number] = ['hi', 5];
// does not disallow adding additional elements
x.push(6);
x.push('mix');
x.push('fix');
// but all elements must be of type specified when defined
// x.push(true); // this doesn't work
/**
 * if not a known index, i.e. an element set at time of variable declaration,
 * union is used and el will possibly be undefined so there is some type safety
 * ``` js
 * x[2].toString(); // doesn't work b/c x[2] may be undefined
 * ```
 */

const trainFares: Array<[number, number?]> = [
  [4], // allowed b/c second el is optional
  [4, 5],
  // [4, 5, 6], // not allowed
];
// trainFares.push([7, 8, 9]); // not allowed
trainFares[1].push(9); // allowed :(

/**
 * using ? does not really make sense since elements can be added regardless
 * and either way, TS will complain that the el could be undefined
 */
const trainFare1: [number, number?] = [4]; // allowed b/c second el is optional
trainFare1.push(6);
trainFare1.push(7); // ts won't complain about this b/c it is ok to add more els
// const fares = trainFare1[1] + trainFare1[0]; // won't work b/c trainFare[1] could be undefined

// better b/c elements can't be added
const trainFare2: readonly [number, number] = [4, 5];
// trainFare2.push(3); // won't work b/c readonly

// possibly best but only if defining implicitly & should be immutable
const trainFare3 = [4, 5] as const;
// trainFare3.push(3); // won't work b/c as const

/**
 * for fixed-length array (but not readonly props)
 */
/**
 * annoying that each index must be specified
 * but could be good for short arrays
 */
// type FixedLengthArray<T> = {
//   0?: T;
//   1?: T;
// } & ReadonlyArray<T>;

/**
 * annoying b/c els at additional indices can be add manually, i.e. arr[4] = 2
 */
// type FixedLengthArray<T> = {
//   [index: number]: T;
// } & ReadonlyArray<T>;

// const getFixedLengthArr = <T>(array: T[]): FixedLengthArray<T> => {
//   const fixedLenArr = [...array];
//   Object.seal(fixedLenArr);
//   return fixedLenArr;
// };
// const fixieArr = getFixedLengthArr([1, 2, 3]);
// fixieArr[0] = 2;
// fixieArr[4] = 2;
// console.log(fixieArr);
// console.log(fixieArr.length);

// const fixedLenNumArr: FixedLengthArray<number, 4> = [1, 2, 3, 4];
// const fixedLenNumArr: FixedLengthArray<number> = [1, 2, 3, 4];
// allows for reassigning props
// fixedLenNumArr[2] = 5;
// fixedLenNumArr[0] = 5;
// fixedLenNumArr[1] = 5;
// fixedLenNumArr[3] = 5;
// fixedLenNumArr[4] = 5;
// fixedLenNumArr.push(30);

// const fixedLenStrArr: FixedLengthArray<string> = ['hi', 'you'];
// fixedLenStrArr.push('person'); // doesn't work
// fixedLenStrArr[0] = 'person';

enum Language {
  English = 'ENGLISH',
  Russian = 'RUSSIAN',
  Spanish = 'SPANISH',
}

const english = Language.English;
const russian = Language[1]; // this shouldn't work
const french = Language[4]; // this shouldn't work

/** important is using const enums generated by others to set tsconfig.json:
 * ```json
 * {
 *   "compilerOptions": {
 *     "preserveConstEnums": true
 *   }
 * }
 * ```
 * use string values with enums
 * might be better to avoid const enums & enums in general
 */
const enum FixedLanguage {
  English = 'ENGLISH',
  Russian = 'RUSSIAN',
  Spanish = 'SPANISH',
}

const spanish = FixedLanguage.Spanish;
console.log(spanish);
// const english2 = FixedLanguage[0]; // doesn't work
// const french2 = FixedLanguage[4]; // this reliably doesn't work

/**
 * Functions
 * for most situations, use function type
 */

/** function type */
type Sum = (num1: number, num2: number) => number;
const sum: Sum = (num1, num2) => num1 + num2;
console.log(sum(5, 6));

/**
 * Overloaded Function Types
 * in general, each overload signature has to be assignable
 * to the implementaion's signature
 */
interface Operation {
  (a: number, b: number): number;
  (a: number, operation: string, b: number): number;
}
const performOp: Operation = (num1: number, num2OrOperation: number | string, num2?: number) => {
  if (num2 === undefined) {
    /** sum is default & if num2 is not defined then num2OrOperation must be a number */
    return num1 + (num2OrOperation as number);
  } else {
    if (num2OrOperation === '-') {
      return num1 - num2;
    }

    if (num2OrOperation === '*') {
      return num1 * num2;
    }

    if (num2OrOperation === '/') {
      return num1 / num2;
    }

    return num1 + num2;
  }
};
console.log(performOp(5, 6)); // 11
console.log(performOp(5, '*', 6)); // 30
// console.log(performOp(5, 8, 6)); // doesn't work
// console.log(performOp(5, 'hi')); // doesn't work

/**
 * Generic type parameter
 * aka polymorphic type parameter
 * used to enforce a type-level constraint in multiple places
 * by convention, people use uppercase T (continuing to U, V, W, etc.) for type
 */
/** scoping this way means T will be inferred */
type Filter = <T>(array: T[], f: (item: T) => boolean) => T[];
/** scoping this way means T must be declared */
// type Filter<T> = (array: T[], f: (item: T) => boolean) => T[];
const filter: Filter = (array, func) => {
  const filteredArr = [];
  for (const item of array) {
    if (func(item)) {
      filteredArr.push(item);
    }
  }
  return filteredArr;
};
const chills = filter(['chill', 'totes chill', 'nope'], (el) => el.includes('chill'));
console.log(chills);

type ArrayMap = <T, U>(array: T[], f: (item: T) => U) => U[];
const map: ArrayMap = (array, func) => {
  const mappedArr = [];
  for (const item of array) {
    mappedArr.push(func(item));
  }
  return mappedArr;
};
/** types can be inferred... */
// const mappedChills = map(chills, (el) => Number(el));
/** ...or explicit */
const mappedChills = map<string, number>(chills, (el) => Number(el));
console.log(mappedChills);
/** takes a subtype of T and returns same subtype */
interface TreeNode {
  value: string;
}
type LeafNode = TreeNode & {
  isLeaf: true;
};
type InnerNode = TreeNode & {
  children: [TreeNode] | [TreeNode, TreeNode];
};

const aTreeNode: TreeNode = { value: 'a' };
const bLeafNode: LeafNode = { value: 'b', isLeaf: true };
const cInnerNode: InnerNode = { value: 'c', children: [bLeafNode] };

/** defines generic type T which must be a TreeNode or subtype of TreeNode */
const mapNode = <T extends TreeNode>(node: T, func: (value: string) => string): T => ({
  ...node,
  value: func(node.value),
});

const aMappedTreeNode = mapNode(aTreeNode, (treeNode) => treeNode.toUpperCase());
const bMappedLeafNode = mapNode(bLeafNode, (leafNode) => leafNode.toUpperCase());
const cMappedInnerNode = mapNode(cInnerNode, (innerNode) => innerNode.toUpperCase());
[aMappedTreeNode, bMappedLeafNode, cMappedInnerNode].forEach((node) => console.log(JSON.stringify(node)));

/** multiple constraints */
interface HasSides {
  numberOfSides: number;
}
interface SidesHaveLength {
  sideLength: number;
}
const logPerimeter = <Quadrilateral extends HasSides & SidesHaveLength>(s: Quadrilateral): void => {
  console.log(s.numberOfSides * s.sideLength);
};
type Square = HasSides & SidesHaveLength;
const square: Square = { numberOfSides: 4, sideLength: 3 };
logPerimeter(square); // 12

/**
 * 1. return type
 * 2. not typesafe - use rest parameters
 * 3.
 */

interface Reservation {
  from?: Date;
  to?: Date;
  destination: string;
}
interface Reserve {
  (from: Date, to: Date, destination: string): Reservation;
  (from: Date, destination: string): Reservation;
  (destination: string): Reservation;
}

const reserve: Reserve = (fromOrDestination: Date | string, toOrDestination?: Date | string, destination?: string) => {
  if (toOrDestination instanceof Date && destination !== undefined) {
    return {
      destination,
      fromOrDestination,
      toOrDestination,
    };
  } else if (fromOrDestination instanceof Date) {
    const theDestination = toOrDestination as string;
    const fromDate = fromOrDestination as Date;
    return {
      destination: theDestination,
      fromDate,
    };
  } else {
    const theDestination = toOrDestination as string;
    return {
      destination: theDestination,
    };
  }
};

type Is = <T>(a: T, ...rest: T[]) => boolean;
const is: Is = <T>(param1: T, ...args: T[]) => args.every((param) => JSON.stringify(param) === JSON.stringify(param1));
console.log(is('string', 'otherstring')); // false
console.log(is(true, false)); // false
console.log(is(42, 42)); // true
// console.log(is(10, 'foo'));
console.log(is('hi', 'hi', 'hi')); // true
console.log(is([1], [1], [1])); // true
console.log(is([1], [1, 2], [1, 2, 3])); // false

/**
 * Interfaces
 * multiple interfaces in same file of same name will automatically merge
 * when two interfaces have a conflict, an error will be thrown
 * generics have to be declared the exact same way for interfaces to be mergeable
 */

interface ExistingUser {
  id: number;
  name: string;
}

const deleteUserId = (user: { id?: number; name: string }) => {
  delete user.id;
};

const existingUser: ExistingUser = {
  id: 1234,
  name: 'User',
};

deleteUserId(existingUser);
/**
 * TS doesn't complain, though id has been deleted
 * This is a good reason to avoid mutation
 */
console.log(existingUser.id);

interface LegacyUser {
  id: number | string;
  name: string;
}

const legacyUser: LegacyUser = {
  id: 555,
  name: 'User',
};

/**
 * This is not allowed b/c, even though the object itself is the same as existingUser,
 * the type is not compatible with ExistingUser b/c the id _could_ be a string.
 * It's required that the type be either the same or a subtype.
 */
// deleteUserId(legacyUser);

/**
 * Type widening
 * When a variable is declared with let or var, its type is widened from its literal value
 * to the base type that the literal belongs to
 */
let aX = 'x'; // string
aX = 'x2';
const dX = 'x'; // 'x' - makes sense b/c can't be reassigned
aX = dX;
aX = 'hello';
const objX = { x: 3 }; // { x: string }
// objX.y = 5; // doesn't work b/c y is not a prop on { x: string }
objX.x = 5; // works b/c mutation is possible
const objY: { y: 5 } = { y: 5 };
// objY.y = 6; // not allowed

/**
 * as const
 * nice b/c it sets all props as readonly, even if deeply nested
 */
const objZ = {
  a: {
    p: {
      t: 'yep',
    },
  },
  z: 5,
} as const;
// objZ.a.p.t = 'nope'; // not allowed b/c a.p.t is readonly

/**
 * Excess property checking
 * when you try to assign a fresh object literal type T to another
 * type U, and T has props that aren't present in U, TS reports an error.
 * Alternatively, if the object either uses a type assertion or is assigned
 * to a variable, then the type is widened to a regular object type.
 *
 * object literals get special treatment and undergo excess property checking
 * when assigning them to other variables or passing them as args. If an object
 * literal has any props that the "target type" doesn't have, you'll get an error.
 */

interface RadObject {
  a: string;
}
const takesRadObject = (radObj: RadObject) => radObj;
let rad1: RadObject = { a: 'rad' };
takesRadObject(rad1);
const rad2 = {
  a: 'rad',
  b: 'bad',
}; // assigning to a variable gets around these checks
takesRadObject(rad2); // type is widened so this works
// takesRadObject({ a: 'rad', b: 'bad' }); // doesn't work b/c obj literal
takesRadObject({ a: 'rad', b: 'bad' } as RadObject); // work b/c obj literal is typed
const rad3 = {
  // trying to type this as RadObject will fail
  a: 'red',
  b: 'bad',
};
rad1 = rad3; // this works even though rad3 is not a RadObject
// rad1 = { // this won't work b/c it's assigned an incompatible type literal
//   a: 'rad',
//   b: 'bad',
// };
rad1 = {
  a: 'rad',
  b: 'bad',
} as RadObject; // this works b/c you're telling it the type is RadObject

/**
 * Discriminated Union
 * if you have a class w/ a literal member then you can use that prop
 * to discriminate b/w union members.
 */

interface Triangle {
  kind: 'triangle';
  side1: number;
  side2: number;
  side3: number;
}

interface Sphere {
  kind: 'sphere';
  radius: number;
}

type Shape = Triangle | Sphere;

const describeShape = (shape: Shape): Shape => {
  if (shape.kind === 'triangle') {
    const { side1, side2, side3 } = shape;
    [side1, side2, side3].forEach((side) => {
      console.log(`side: ${side}`);
    });
    return shape;
  }
  // shape must be Sphere
  console.log(shape.radius);
  return shape;
};
