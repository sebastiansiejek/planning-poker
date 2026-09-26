import { randomUUID } from "node:crypto";

import { expect, test } from "@playwright/test";

import { getPrisma } from "@/shared/database/prisma";
import { databaseTestAuth } from "@/shared/lib/tests/utilities";

test.describe("public language routes", () => {
  test.use({ locale: "pl-PL" });
  test("detects Polish, remembers a language switch and preserves the URL", async ({
    page,
  }) => {
    await page.goto("/?source=test#intro");
    await expect(page).toHaveURL("/pl?source=test#intro");
    await expect(page.locator("html")).toHaveAttribute("lang", "pl");
    await expect(page.getByTestId("start-new-game")).toHaveText(
      "Utwórz nową grę",
    );
    await page.getByRole("combobox", { name: "Język" }).click();
    await page.getByRole("option", { name: "English", exact: true }).click();
    await expect(page).toHaveURL("/en?source=test#intro");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.goto("/");
    await expect(page).toHaveURL("/en");
    await expect(page.getByTestId("start-new-game")).toHaveAttribute(
      "href",
      "/en/game/create",
    );
  });

  test("protects localized routes and preserves the sign-in destination", async ({
    page,
    request,
  }) => {
    await page.goto("/pl/game/example-room?source=test");
    await expect(
      page.getByRole("button", { name: "Kontynuuj z Google" }),
    ).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/pl/login");
    expect(new URL(page.url()).searchParams.get("callbackUrl")).toBe(
      "/pl/game/example-room?source=test",
    );
    await page.getByRole("combobox", { name: "Język" }).click();
    await page.getByRole("option", { name: "English", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Continue with Google" }),
    ).toBeVisible();

    // Check the callback passed to NextAuth without leaving the app or contacting Google.
    await page.route("**/api/auth/signin/google", async (route) => {
      const form = new URLSearchParams(route.request().postData() || "");
      expect(form.get("callbackUrl")).toBe("/en/game/example-room?source=test");
      await route.fulfill({ json: { url: "http://localhost:3000/en" } });
    });
    await page.getByRole("button", { name: "Continue with Google" }).click();
    await expect(page).toHaveURL("/en");

    const response = await request.get("/api/auth/providers");
    expect(response.status()).toBe(200);
    expect((await response.json()).google.id).toBe("google");
    await page.goto("/pl/missing-page");
    await expect(
      page.getByRole("heading", { name: "Nie znaleziono strony" }),
    ).toBeVisible();
  });
});

test.describe("signed-in language routes", () => {
  databaseTestAuth();

  for (const locale of ["en", "pl"]) {
    test(`create, switch language and rejoin a room in ${locale}`, async ({
      page,
    }) => {
      let roomId: string | undefined;
      const polish = locale === "pl";
      try {
        await page.goto(`/${locale}/game/create`);
        await page.getByTestId("create-game-submit").click();
        await expect(
          page.getByText(polish ? "Nazwa jest wymagana" : "Name is required", {
            exact: true,
          }),
        ).toBeVisible();
        await page.getByTestId("game-name").fill(`locale-${randomUUID()}`);
        await page.getByTestId("create-game-submit").click();
        await page.waitForURL(new RegExp(`/${locale}/game/(?!create$)[^/]+$`));
        roomId = new URL(page.url()).pathname.split("/").at(-1);
        await expect(page.getByTestId("create-game-trigger-button")).toHaveText(
          polish ? "Rozpocznij" : "Start",
        );

        const otherLocale = polish ? "en" : "pl";
        await page
          .getByRole("combobox", { name: polish ? "Język" : "Language" })
          .click();
        await page
          .getByRole("option", {
            name: polish ? "English" : "Polski",
            exact: true,
          })
          .click();
        await expect(page).toHaveURL(`/${otherLocale}/game/${roomId}`);
        await expect(page.getByTestId("create-game-trigger-button")).toHaveText(
          polish ? "Start" : "Rozpocznij",
        );

        await page.goto(`/${locale}/game/join`);
        const roomInput = page.getByRole("textbox", {
          name: polish ? "ID pokoju" : "Room ID",
        });
        await roomInput.click();
        await roomInput.fill(roomId!);
        await expect(roomInput).toHaveValue(roomId!);
        await page
          .getByRole("button", {
            name: polish ? "Dołącz" : "Join",
            exact: true,
          })
          .click();
        await expect(page).toHaveURL(`/${locale}/game/${roomId}`);
        await page.getByTestId("create-game-trigger-button").click();
        await page.getByTestId("create-game-submit").click();
        await page.getByTestId("voting-card-3").click();
        await page.getByTestId("reveal-cards-button").click();
        await expect(page.getByTestId("voting-avg")).toHaveText(
          polish ? "Średnia: 3" : "Average: 3",
        );

        await page.goto(`/${locale}/dashboard/user-settings`);
        await expect(
          page.getByRole("button", { name: polish ? "Zapisz" : "Save" }),
        ).toBeVisible();
        await expect(page).toHaveTitle(
          new RegExp(polish ? "Ustawienia" : "Settings"),
        );
        await page
          .getByRole("button", { name: "Test User", exact: true })
          .click();
        await page
          .getByRole("menuitem", { name: polish ? "Wyloguj się" : "Logout" })
          .click();
        await expect(page).toHaveURL(`/${locale}`);
        await expect(
          page.getByRole("link", {
            name: polish ? "Zaloguj się" : "Sign in",
            exact: true,
          }),
        ).toBeVisible();
      } finally {
        if (roomId) await getPrisma().room.delete({ where: { id: roomId } });
      }
    });
  }
});
