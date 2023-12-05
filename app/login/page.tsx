

import { CardWithForm } from "@/components/loginform"
import { PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page-header"



export default function IndexPage() {
  return (
<>
      <div className="container relative pb-8">

        <PageHeaderDescription>
          You need to create a new user to have your own watchlist
        </PageHeaderDescription>


        </div>
        <div className="container relative pb-8">

        <CardWithForm />
        </div>

    </>
  )
}
