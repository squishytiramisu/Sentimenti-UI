"use client"

import React, { useEffect } from "react"
import Link from "next/link"

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
import { Button, buttonVariants } from "@/components/ui/button"
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
import {
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header"
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
import { Overview } from "@/components/dashboard"
import { cn } from "@/lib/utils"

export default function IndexPage() {
  const [headlines, setHeadlines] = React.useState<any[]>([])

  const [tickerNews, setTickerNews] = React.useState<any[]>([])

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      loadHeadlines()
    }
  }, [])

  const loadHeadlines = () => {
    fetch(
      "http://localhost:8080/api/news/" +
        localStorage.getItem("sentimentiUsername"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          return await response.json()
        }
        const errorMsg = await response.text()
        throw new Error(errorMsg)
      })
      .then((response: any[]) => {
        setHeadlines(response)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const calcColor = (score: number) => {
    if (score > 0.5) {
      return " text-green-500"
    } else if (score > 0.25) {
      return " text-green-300"
    } else if (score >= 0) {
      return ""
    } else if (score > -0.25) {
      return " text-red-300"
    } else {
      return " text-red-500"
    }
  }

  const calcColorString = (score: string) => {
    if(score === "VeryPositive"){
      return " text-green-500"
    }else if(score === "Positive"){
      return " text-green-300"
    }else if(score === "Neutral"){
      return ""
    }
    else if(score === "Negative"){
      return " text-red-300"
    }
    else if(score === "VeryNegative"){
      return " text-red-500"
    }
    else{
      return ""
    }
  }

  const selectTicker = (ticker: string) => {
    if(ticker === ""){
      return
    }

    setTickerNews([])
    fetch(
      "http://localhost:8080/api/news/ticker/" +ticker,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(async (response) => {
        if (response.ok) {
          return await response.json()
        }
        const errorMsg = await response.text()
        throw new Error(errorMsg)
      })
      .then((response) => {
        var replaced = response.map((ticker: { sentiment: string }) => {
          if(ticker.sentiment === "Undefined"){
            ticker.sentiment = "No analysis yet"
          }})
        setTickerNews(response)
      })
      .catch((error) => {
        console.error(error)
      })
    }


  return (
    <>
      <div className="container relative pb-8">
        <PageHeaderHeading className="hidden md:block">
          Your Watchlist
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">Watchlist</PageHeaderHeading>
        <PageHeaderDescription>
          Read about the latest news about popular companies in your watchlist
        </PageHeaderDescription>
        <section className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
            <Link
              href="/settings"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-[6px]"
              )}
            >
              Edit Watchlist
            </Link>
          </section>
      </div>

      <div className="flex w-full justify-center">
        <div className="mx-3 py-2">
        <Card className="w-auto">
            <CardHeader>
              <CardTitle> Ticker Summary</CardTitle>
              <CardDescription>Click on a row to view news</CardDescription>
            </CardHeader>
            <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Ticker</TableHead>
                <TableHead>Sentiment score</TableHead>
                <TableHead>Headline</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {headlines.map((ticker) => (
                <TableRow key={ticker.topHeadline} onClick={()=> selectTicker(ticker.topHeadline)}>
                  <TableCell className="font-bold">
                    {ticker.topHeadline}
                  </TableCell>
                  <TableCell
                    className={"font-bold" + calcColor(ticker.headlineScore)}
                  >
                    {ticker.headlineScore.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-bold">{ticker.ticker}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
        </div>
        <div className="mx-3 w-auto py-2">
          <Card className="w-auto">
            <CardHeader>
              <CardTitle>{tickerNews.length > 0 ? tickerNews[0].ticker.ticker : "Select a ticker"}</CardTitle>
              <CardDescription>Ticker news</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Summary</TableHead>
                <TableHead>Sentiment score</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickerNews.map((ticker) => (
                <TableRow key={ticker.description}>
                  <TableCell >
                    {ticker.description}
                  </TableCell>
                  <TableCell
                    className={"font-bold" + calcColorString(ticker.sentiment)}
                  >
                    {ticker.sentiment}
                  </TableCell>
                  <TableCell className="font-bold">{new Date(ticker.date).toISOString().slice(0,10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
        </div>
      </div>
      <Toaster />
    </>
  )
}
