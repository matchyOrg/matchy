<template>
  <teleport to="#nav-title">🌱 About Us</teleport>
  <v-main class="mx-9 mt-5">
    <p>
      Check the out this project's
      <a class="text-grey" href="https://github.com/sueszli/matchy"
        >Github page</a
      >
      to see the source-code and find out who we are, what we're all about and
      what we are aiming to achieve.
    </p>

    <h2 class="mt-10">👨‍💻 The Devs</h2>
    <p>
      The development team is currently composed of the following main
      contributors:
    </p>

    <h3 class="mt-7 font-weight-regular">
      <b>Marco </b>
      <a class="text-grey" href="https://github.com/MJDeligan">@MJDeligan</a>
    </h3>
    <i>The Architect.</i> <br />
    Marco took the responsibility of designing the application architecture and
    implementing the backend almost entirely by himself (Postgres database,
    Postgres CRON jobs, API via Supabase, Lambda functions, RPCs, user input
    validation ...).
    <br />
    He also created many useful diagrams that helped us understand the real time
    processes that this application is built on, implemented huge chunks of the
    frontend and improved the overall performance and security of this
    application greatly.

    <h3 class="mt-7 font-weight-regular">
      <b>Stefan </b>
      <a class="text-grey" href="https://github.com/stefnotch">@stefnotch</a>
    </h3>
    <i>The Frontend Sensei.</i> <br />
    Stefan is the most knowledgeable frontend developer in the team. He reviewed
    every single of our pull requests and helped us get a better understanding
    of advanced Vue.js concepts.
    <br />
    He decided which technologies to use for the frontend, set up all necessary
    dependencies and always found the most elegant and efficient solutions to UI
    / UX problems.
    <br />
    He is the teams frontend Sensei because he was really patient with newcomers
    and taught them everything they needed to know about Vue.js.

    <h3 class="mt-7 font-weight-regular">
      <b>Yahya </b>
      <a class="text-grey" href="https://github.com/sueszli">@sueszli</a>
    </h3>
    <i>The Kickstarter.</i> <br />
    This app was initially his idea and his second attempt based on a previous
    iteration called
    <a class="text-grey" href="https://github.com/sueszli/datewatch">
      DateWatch</a
    >.
    <br />
    After defining the necessary features for this iteration and designing the
    mockups, Yahya gathered all his friends to team up and kick off.
    <br />
    He kept the bigger picture at all times by contributing to all aspects of
    the application and managed the project effectively.

    <h3 class="mt-7 font-weight-regular">
      <b>Daniel </b>
      <a class="text-grey" href="https://github.com/Fancy11111">@Fancy11111</a>
    </h3>
    <i>The Rapid Prototyper.</i> <br />
    Daniel is the rapid prototyper in the team with the most experience in the
    software industry. He developed essential features reliably with a high
    quality.

    <h2 class="mt-10">🧑‍🤝‍🧑 The Community</h2>
    <p>
      But the development itself wouldn't be possible without the great help of
      our friends and the Matchy community, consistently giving us valuable
      feedback on how to improve and motivating us to stay on track.
    </p>
    <p class="mt-5 mb-10">
      We really hope that this project brings you joy and helps you make fun
      memories and lasting relationships.
    </p>
  </v-main>
</template>

<style scoped>
h3 a {
  text-decoration: none;
}
i {
  display: inline-block;
  letter-spacing: 0.05rem !important;
  font-weight: 500 !important;
  margin-bottom: 0.3rem !important;
  color: #999 !important;
}
</style>
