Howdy friend! <br>
In this open source project, we're making speed dating paperless! 💌

> Sounds interesting? Feel free to put this project on your watch list by clicking the `watch` button above and coming back later when there is more progress made or give it a star.

This [simplified mockup](https://www.figma.com/file/ClWUVCuVzjNAG4Gat5TO10/matchy-V2-(Read-Only)?node-id=9%3A1033) gives you an idea of where we're trying to get.
<br><br><br><br>


## How does conventional speed dating work?

Here's a quick [video demo](https://www.youtube.com/watch?v=p-3cmlPnx0s&t=9s).

When you arrive at the event, a host will sign you up and you will receive a card with your name on it. <br>
There will be two rows sitting in front of eachother at tables and one these rows will remain seated while the other one rotates about every 3-4 mins. Think of the dates as mini introductions. <br>
You will use your card to mark down if you are interested in the people you meet.

After the event, each of the participants will give their cards to the host to process. The host will then contact each person individually and send them their matches' contact data.
<br><br><br><br>


## How are we improving it?

With our app, the hosts no longer have to print any cards, use a clock to time the dates or spend countless hours after the events determining the matches and contacting the participants.

Let's do the math!  
Let's assume that we have $n$ participants, split into two groups. For example, 40 participants in total, of which there are 20 in each group.
Each participant speed-dates everyone from the other group and fills out their cards as they go along. This gives you $n$ (40) cards, each with $\frac{n}{2}$ (20) reviews. 

Now, when going through a single card, the host will check if the participant liked the other one. If yes, time to search for their card, and check if they also liked our participant. Then we need somewhere between $0$ and $\frac{n}{2}$ (20) card comparisons to determine the matches for a *single* person. Now you can manually note down all of the contact information of that person's matches and send it to them.

Repeat this for every single of the $n$ (40) participants, and you have at most $(n \cdot \frac{n}{2})$ (800) card comparisons to determine all the matches.

Now assuming that we do this as efficient as possible by iterating through each date that happened at the event once instead of twice from both sides (in the description above we iterated through the people, not the dates) we still have $(\frac{n}{2})^2$ comparisions and in our example the host has to do $400$ comparisons for just $40$ participants. This is time consuming to say the least.

*In short:* Matchy digitalizes the old school speed dating paperwork process and lets you focus on what matters most: making fun experiences and lasting relationships. 
<br><br><br><br>


## Who is this for?

The main goal of this app is to provide existing speed friending or dating organizations with a better alternative to pen and paper after some of them reached out to us - so we already know that there is a demand for it!

Here are some selected non profits in Vienna, that we are aiming to help out:
- https://www.meetup.com/speed-friending-events/ (over 8800 members in Vienna)
- https://esnuniwien.com/events/speedfriending-esn-1
- https://events.htu.at/events/d58a7134-469b-4528-bc4a-dca2e7b1fa74
- https://www.wien.gv.at/video/1482/Speeddating-unter-Pensionisten

But effectively anyone can use it to throw their own event!
<br><br><br><br>


## How can I join you guys and contribute?

Joining the community doesn't require you to commit to anything / contribute anything. <br>
You can just [join our wonderful discord server](https://discord.gg/tFf2RkTg) and just have a good time, meme around and get to know us. <br>
Most of us are students or working as software engineers and have pretty tight schedules - so we can totally understand if you're unsure whether you really want to put in the time / energy. We want the development process to be fun. We don't have any deadlines. 🍜🐱 <br>
There are so many ways you could contribute! You don't even necessarily have to code to be part of our team. <br>
Also: If you feel like the project is overwhelming / too complex, don't worry! We're here to help you out and introduce you to the technologies we're using.

If you feel ready to contribute:
- Check out the `CONTRIBUTING.md` file. It's an in depth guide to this app.
- Access all relevant documents, resources and references of this project on our public notion page: https://sueszli.notion.site/matchy-457ed5cee087469ab5ff78e67bacf3b6
