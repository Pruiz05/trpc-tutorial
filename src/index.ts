import express from 'express'
import * as trpc from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import { string, z } from 'zod'

let cars = [
    {
        id: "CAR001",
        brand: "TOYOTA",
        model: "COROLLA",
        year: 2011
    },
    {
        id: "CAR002",
        brand: "HONDA",
        model: "CIVIC",
        year: 2017
    }
]

const app = express()
const appRouter = trpc.router()
    .query('hello', {
        resolve() {
            return 'Hello world!'
        }
    })
    .query('getCars', {
        resolve() {
            return cars
        }
    })
    .mutation('createCar', {
        input: z.object({
            id: z.string(),
            brand: z.string(),
            model: z.string(),
            year: z.number()
        }),
        resolve({ input }) {
            console.log('input val:', input)
            cars.push(input)
            return 'car created'
        }
    })


export type AppRouter = typeof appRouter


app.use(cors())
app.use('/trpc', trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null
}))

app.listen(8002)
console.log('app listening on port 8002')

