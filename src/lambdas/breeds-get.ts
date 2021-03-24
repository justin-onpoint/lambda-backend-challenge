import fetch from 'node-fetch'
import { Response } from './types'
interface BreedsResponse extends Response {
  body: string[]
}
interface ErrorResponse extends Response {
  message: string
}
interface Breeds {
  [key: string]: string[]
}
interface DogBreeds {
  message: Breeds, 
  status: string
}
function convertNestedDict(nested: DogBreeds): string[] {
  // const obj = JSON.parse(nested)
    const db = nested.message
    let flat = []
    for (const item in db){
        let value = db[item]
        if (value.length === 0){
            flat.push(item)
        } else{
            let sub = String(value)
            let subs = sub.split(",")
            for (const name of subs){
                flat.push(name+" "+item)
            }
        }
    }
    return flat;
}

export async function handler(): Promise<BreedsResponse | ErrorResponse> {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/list/all')
      const payload: DogBreeds = await res.json()
      const data = convertNestedDict(payload)
    //   const payload: any = await res.json()
      return {
        statusCode: 200,
        body: data,
      }
    } catch (err: unknown) {
      return {
        statusCode: 500,
        message: 'Something went wrong',
      }
    }
  }