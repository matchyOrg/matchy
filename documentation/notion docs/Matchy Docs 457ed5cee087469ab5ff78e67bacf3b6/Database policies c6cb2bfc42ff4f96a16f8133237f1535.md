# Database policies

This is a collection of all the policies that are required for users to interact with the database safely.

### User

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| Themself | Any by anyone | None. | Themself. |

### Profile

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| User’s own profile. | User’s own profile. | User’s own profile. | None. |
| Profiles of users they matched with |  |  |  |

### Event

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| Any. | Any by authenticated users if they are the organizer. | Events the user is the organizer of. | None. |

### Group

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| Any. | Any by authenticated users. | None. | None. |

### Group-Pairs

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| Any. | Any by authenticated users. | None. | None. |

### Event Registration

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| The user’s registrations. | Registration to events by authenticated users. | The user’s registrations. | The user’s registrations. |
| Registrations to events the user is the organizer of. |  |  | Registrations to events the user is the organizer of. |
| Registrations to events the user participates in (Required for pairing constraints) |  |  |  |

### Event User Pair

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| Pairs where the user is the main or other user | Any by authenticated user where the are the main user | Organizer can update user pairs of their events. | None. |
| Pairs for events the user is an organizer of |  |  |  |

### Vote

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| The user’s own votes. | Any by authenticated user where they are the voting user and they are part of the pair. | Their own votes. | None. |
| Votes for event pairs of event rounds of events that the user is an organizer of. |  |  |  |

### Event Round

| Select | Insert | Update | Delete |
| --- | --- | --- | --- |
| Any event round of events the user is registered in. | Any by authenticated user for events that they are an organizer for. | None. | None. |
| Any event round of events the user is organizing. |  |  |  |