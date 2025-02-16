# Lower Mainland Pools

[See which pools are open -- and how long it has been since they were last cleaned -- at a glance!](https://shmootidy.github.io/lower-mainland-pools/#/)

![lower-mainland-pools](/public/lower-mainland-pools.png)

View a pool's daily schedule, without all the noise of the City of Vancouver's website!

![pool](/public/pool.png)

And never be disappointed (or itchy from over-chlorinated water) again!

## How It's Made

**Tech Stack**

- **Frontend**:
  - React19
  - Vite
  - FontAwesome
  - Emotion Styled Components
  - React Query
  - TypeScript
  - Luxon
  - **Testing software**:
    - React Testing Library
    - Vitest
    - MSW
  - Hosted on **Github**
- **Backend**:
  - JavaScript
  - Supabase
  - Dotenv
  - Cheerio
  - Undici
  - Monthly cron job triggered by **Github**
  - Hosted on **Vercel**

_You can visit my backend repo [here](https://github.com/shmootidy/vercel-vancouver-pools-proxy)._

## What Drove Me To This

I don't like swimming in dirty pools. Well, "dirty" might be a bit harsh; the city does a good job with its facilities and I appreciate the work they do. But I'm sensitive to chlorine. And when I can see floaty bits in the water, it dampens my enjoyment.

Vancouver's pools don't share when they were last cleaned. Maybe that info is available somewhere, but not in their OpenSoft API (which is really neat) and not on their pool websites.

They do, however, share when they _are_ being cleaned! And I know how to update a database ;)

And so I flexed my skills:

- **A Monthly Cron Job**:
  - Gets the latest calendar of all the Vancouver pools and scans them for closures.
  - If a pool is closed, it visits that pool's website and looks for alerts explaining why.
  - Then, it updates the database with the poolID, the reason for its closure, and when it is expected to reopen.
- **A Serverless Backend**:
  - Handling queries to the database and to the current pool calendars.
- **A React Frontend**:
  - Displaying the daily schedule, the cleanliness of a pool (or lack of that information...just gotta wait for the passage of time and the cron to job), and its amenities.
  - Fully tested because tests are the best way to make sure everything is working and will continue to work.

## Things I Learned

- You can't deploy a react app if you're using `react-router-dom`'s `createBrowserRouter`. Well, you technically _can_ deploy it, but the app won't work. You have to use `createHashRouter` and `<Link />` links.
- Building with the latest versions of popular packages mean that a lot of StackOverflow (and ChatGPT) tips will be misleading. This was frustrating at times. (RTFM, Shmoo!)

## Things To Do

- **Type the backend**, my GOD! After 4+ years in a strictly TS environment, working with untyped variables feels like tightrope walking without a net.
- **Add more pools**: Richmond, Burnaby, North Van, Squamish... My queries are _very_ Vancouver-idiosyncratic, fine-tuned to the particularities of the calendar endpoint and each pool's website. Each new city and/or pool (depending on how those pools are organized) will require its own backend.
- **Update the styling**. I didn't put a ton of work into this part of the app. It's mostly the boilerplate styling that came with React.
- **Add interfacing** for a convenient way to update the database. I have fields in my database for things like "do you need a quarter for the lockers here?" so I don't have to keep buying one from reception with my credit card.
