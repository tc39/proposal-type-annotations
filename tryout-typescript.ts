const x: (number | string) = 1

function foo(x: any): x is number {
  return true
}

function f<T extends boolean>(x: T): (T extends true ? string : number) {
  return 1 as (T extends true ? string : number)
}


type ReturnTypeZ<T> = (T extends (...args: any[]) => infer R ? R : any);

function foo2() {
  type X = number
  interface Point {x: number, y: number}

  function bar(x: X, p: Point) {

  }

  bar()
}