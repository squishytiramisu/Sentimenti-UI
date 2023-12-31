"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { Label } from "recharts"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/toaster"
import { toast, useToast } from "@/components/ui/use-toast"
import { Overview } from "@/components/dashboard"
import { Icons } from "@/components/icons"

export default function IndexPage() {
  const [tickers, setTickers] = React.useState<any[]>([])

  const [availableTickers, setAvailableTickers] = React.useState<any[]>([])

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      let username = localStorage.getItem("sentimentiUsername")

      if (username) {
        fetch(localStorage.getItem("beurl")+"/api/user/" + username + "/watchlist")
          .then(async (response) => {
            if (response.ok) {
              return await response.json()
            }
            const errorMsg = await response.text()
            throw new Error(errorMsg)
          })
          .then((response: any[]) => {
            setTickers(response)
          })
          .catch((error) => {
            console.error(error)
          })

        fetch(localStorage.getItem("beurl")+"/api/ticker")
          .then(async (response) => {
            if (response.ok) {
              return await response.json()
            }
            const errorMsg = await response.text()
            throw new Error(errorMsg)
          })
          .then((response: any[]) => {
            setAvailableTickers(response)
          })
          .catch((error) => {
            console.error(error)
          })
      } else {
        window.location.href = "/login"
      }
    }
  }, [tickers])

  const tickerSelected = (ticker: string) => {
    if (!ticker) {
      return
    }
    fetch(
      localStorage.getItem("beurl")+"/api/user/" +
        localStorage.getItem("sentimentiUsername") +
        "/watchlist/" +
        ticker,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          return response
        }
        const errorMsg = await response.text()
        throw new Error(errorMsg)
      })
      .then((response) => {
        toast({
          title: "Added to watchlist",
        })
        setTickers([...tickers])
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const deleteTicker = (ticker: string) => {
    if (!ticker) {
      return
    }
    fetch(
      localStorage.getItem("beurl")+"/api/user/" +
        localStorage.getItem("sentimentiUsername") +
        "/watchlist/" +
        ticker,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          return response
        }
        const errorMsg = await response.text()
        throw new Error(errorMsg)
      })
      .then((response) => {
        toast({
          title: "Deleted ticker",
        })
        setTickers([...tickers])
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const collectNews = (event: any) => {
    event.preventDefault()
    setIsLoading(true)
    fetch(localStorage.getItem("beurl")+"/api/admin/collectNews/RapidAPI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response
        }
        const errorMsg = await response.text()
        throw new Error(errorMsg)
      })
      .then((response) => {
        toast({
          title: "Collected news",
        })
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }

  const collectSentiment = (event: any) => {
    event.preventDefault()
    setIsLoading(true)
    fetch(localStorage.getItem("beurl")+"/api/admin/analyzeNews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response
        }
        const errorMsg = await response.text()
        throw new Error(errorMsg)
      })
      .then((response) => {
        toast({
          title: "Analyzed sentiment",
        })
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <div className="mx-3 w-96 py-2">
          <Table>
            <TableCaption>A list of your active tickers</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ticker</TableHead>
                <TableHead>News</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickers.map((ticker) => (
                <TableRow key={ticker.id}>
                  <TableCell className="font-medium">{ticker.ticker}</TableCell>
                  <TableCell>{ticker.news.length}</TableCell>
                  <TableCell>
                    {" "}
                    <Button onClick={() => deleteTicker(ticker.ticker)}>
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mx-3 w-96 py-2">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Add to watchlist</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button>Add</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Available tickers</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {availableTickers.map((ticker) => (
                        <DropdownMenuItem
                          key={ticker}
                          onSelect={() => tickerSelected(ticker)}
                        >
                          {ticker}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
        </div>
      </div>
      {window.localStorage.getItem("sentimentiUsername") === "admin" ? (
        <div className="flex w-full justify-center">
          <Button className="mx-2" onClick={collectNews}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              ""
            )}{" "}
            Collect news
          </Button>
          <Button className="mx-2" onClick={collectSentiment}>
          {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              ""
            )}{" "}
            Analyize sentiment
          </Button>
        </div>
      ) : null}
      <Toaster />
    </>
  )
}
