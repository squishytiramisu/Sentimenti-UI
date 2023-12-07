
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

export function CardWithForm() {

    const [ username, setUsername ] = React.useState<string | null>(null);
    const [ password, setPassword ] = React.useState<string | null>(null);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    };

    const [ login, setLogin ] = React.useState<string | null>(null);

    const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLogin(event.target.value);
    };


    const handleSubmit = () => {
      fetch(localStorage.getItem("beurl")+'/api/user/'+username, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then( async (response) => {
        if (response.ok) {
          return await response.text();
        }
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      })
      .then((response : string) => {
        console.log(response);
        // Empty the form and refresh
        localStorage.setItem('sentimentiUsername', username || "");
        
        // Go to the dashboard
        window.location.href = "/";
        
      })
      .catch((error: Error) => {
        console.log(error);
        alert(error.message);
      });
      
    };

    const handleLogin = () => {
      if (!login) {
        alert("Please enter a username");
        return;
      }
      localStorage.setItem('sentimentiUsername', login || "");
      window.location.href = "/";
    };


  return (

  <>
  <div className="flex justify-evenly py-2">
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create a user</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Username</Label>
              <Input id="name" placeholder="Enter a username" value={username || ""} onChange={handleUsernameChange}/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter a safe password" value={password || ""} onChange={handlePasswordChange} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/" className="flex items-center space-x-2">
            <Button variant="outline">Cancel</Button>
        </Link>
        
        <Button onClick={handleSubmit}>Sign up</Button>
      </CardFooter>
    </Card>

<Card className="w-[350px]">
<CardHeader>
  <CardTitle>Sign in</CardTitle>
  <CardDescription></CardDescription>
</CardHeader>
<CardContent>
  <form>
    <div className="grid w-full items-center gap-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Username</Label>
        <Input id="name" placeholder="Enter your username" value={login || ""} onChange={handleLoginChange}/>
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter your password" />
      </div>
    </div>
  </form>
</CardContent>
<CardFooter className="flex justify-center">  
  <Button onClick={handleLogin}>Login</Button>
</CardFooter>
</Card>
  </div>
</>

  )
}
