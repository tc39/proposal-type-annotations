const x: (number | string) = 1

function foo(x: any): x is number {
  return true
}

function f<T extends boolean>(x: T): (T extends true ? string : number) {
  return 1 as (T extends true ? string : number)
}


type ReturnTypeZ<T> = (T extends (...args: any[]) => infer R ? R : any);
