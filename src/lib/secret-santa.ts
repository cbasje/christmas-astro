import type { User } from "src/db/schema/auth";

type UserId = User["id"];
type Pairing = Map<UserId, UserId>;

export default class SecretSanta {
    private people: UserId[] = [];
    private couples: Pairing = new Map();

    constructor(users: Pick<User, "id" | "partnerId">[]) {
        for (const u of users) {
            this.people.push(u.id);

            if (u.partnerId !== null) {
                this.couples.set(u.id, u.partnerId);
            }
        }
        // this.people = people;
        // this.couples = new Map(
        //     couples.flatMap(([p1, p2]) => [
        //         [p1, p2],
        //         [p2, p1],
        //     ]),
        // );
    }

    generatePairings(): Pairing {
        const maxAttempts = 100;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const pairings: Pairing = new Map();
            const availableRecipients = new Set(this.people);

            for (const giver of this.people) {
                const validRecipients = this.findValidRecipients(
                    giver,
                    availableRecipients,
                );

                if (validRecipients.length === 0) {
                    break; // Failed this attempt
                }

                // Choose a random valid recipient
                const randIndex = Math.floor(
                    Math.random() * validRecipients.length,
                );
                const recipient = validRecipients[randIndex];

                pairings.set(giver, recipient);
                availableRecipients.delete(recipient);
            }

            // Check if all people were successfully paired
            if (pairings.size === this.people.length) {
                return pairings;
            }
        }

        throw new Error(
            "Could not generate a valid Secret Santa pairing. Try again.",
        );
    }

    private findValidRecipients(
        giver: UserId,
        availableRecipients: Set<UserId>,
    ): UserId[] {
        return Array.from(availableRecipients).filter(
            (recipient) =>
                // Cannot give to self
                recipient !== giver &&
                // Cannot give to partner
                this.couples.get(giver) !== recipient,
        );
    }
}
