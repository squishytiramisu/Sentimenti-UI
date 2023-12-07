"use client"

import React, { useEffect } from "react"

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
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/ui/page-header"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function IndexPage() {
  const [headlines, setHeadlines] = React.useState<any[]>([])

  useEffect(() => {


    if (typeof window !== "undefined" && window.localStorage) {
      if(!localStorage.getItem("beurl")){
        localStorage.setItem("beurl", "http://localhost:8080")
      }
      loadHeadlines()
    }
  }, [])

  const loadHeadlines = () => {
    fetch(localStorage.getItem("beurl")+"/api/news/headlines", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
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
    }else if (score > 0.25) {
      return " text-green-300"
    }else if (score >= 0) {
      return " "
    }else if (score > -0.25) {
      return " text-red-300"
    }else {
      return " text-red-500"
  }
}

  return (
    <>
      <div className="container relative pb-8">
        <PageHeaderHeading className="hidden md:block">
          Headlines
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">Examples</PageHeaderHeading>
        <PageHeaderDescription>
          Read about the latest news about popular companies
        </PageHeaderDescription>
        </div>

        <div className="flex w-full justify-center">
        <div className="mx-3 py-2">
        <Card className="w-auto">
            <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Ticker</TableHead>
                  <TableHead>Sentiment score</TableHead>
                  <TableHead>Biggest headline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {headlines.map((ticker) => (
                  <TableRow key={ticker.topHeadline}>
                    <TableCell className="font-bold">{ticker.topHeadline}</TableCell>
                    <TableCell className={"font-bold" + calcColor(ticker.headlineScore)} >
                      {ticker.headlineScore.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-bold" >{ticker.ticker}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
          </div>
          <div className="mx-3 w-96 py-2"></div>
        </div>
    </>
  )
}
