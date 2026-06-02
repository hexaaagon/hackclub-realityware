import type {
  AllMiddlewareArgs,
  SlackActionMiddlewareArgs,
  SlackEventMiddlewareArgs,
} from "@slack/bolt";
import type { StringIndexed } from "@slack/bolt/dist/types/helpers";
import { glob } from "glob";
import type { app as slackApp } from "../app/index";

export type RejectionAnswer =
  | null
  | boolean
  | {
      reason: string;
    };

export type EventManifest<Event extends string = string> = {
  title: string;
  event: Event;
};
export type EventHandlerArgs<Event extends string = string> =
  SlackEventMiddlewareArgs<Event> & AllMiddlewareArgs<StringIndexed>;
export type EventHandler = (
  app: typeof slackApp,
  args: EventHandlerArgs,
) => Promise<void> | void;

export function eventHandler(app: typeof slackApp) {
  const eventFiles = glob.sync("./events/**/*.ts", { cwd: "./src/app" });

  for (const file of eventFiles) {
    import(`../app/${file}`)
      .then(
        ({
          manifest,
          handler,
        }: {
          manifest: EventManifest;
          handler: EventHandler;
        }) => {
          if (!manifest || !handler) {
            console.warn(
              `⚠️  Event file ${file} is missing a manifest or handler export and will be skipped.`,
            );
            return;
          }

          const { event } = manifest as EventManifest;

          app.event(event, async (args) => {
            try {
              await handler(app, args);
            } catch (e) {
              console.error(
                `Error handling event "${manifest.title}":`,
                e instanceof Error ? e.stack : e,
              );
            }
          });

          console.log(
            `✅ Registered event handler: ${manifest.title} (${event})`,
          );
        },
      )
      .catch((e) => {
        console.error(`Error loading event handler from file ${file}:`, e);
      });
  }
}

export type ActionManifest = {
  title: string;
  trigger: string;
};
export type ActionHandlerArgs = SlackActionMiddlewareArgs &
  AllMiddlewareArgs<StringIndexed>;
export type ActionHandler = (
  app: typeof slackApp,
  args: ActionHandlerArgs,
) => Promise<void> | void;

export function actionHandler(app: typeof slackApp) {
  const actionFiles = glob.sync("./actions/**/*.ts", {
    cwd: "./src/app",
  });

  for (const file of actionFiles) {
    import(`../app/${file}`)
      .then(
        ({
          manifest,
          handler,
        }: {
          manifest: ActionManifest;
          handler: ActionHandler;
        }) => {
          if (!manifest || !handler) {
            console.warn(
              `⚠️  Action file ${file} is missing a manifest or handler export and will be skipped.`,
            );
            return;
          }

          const { trigger } = manifest as ActionManifest;

          app.action(trigger, async (args) => {
            try {
              await handler(app, args);
            } catch (e) {
              console.error(
                `Error handling action "${manifest.title}":`,
                e instanceof Error ? e.stack : e,
              );
            }
          });

          console.log(`✅ Registered action handler: ${manifest.title}`);
        },
      )
      .catch((e) => {
        console.error(`Error loading action handler from file ${file}:`, e);
      });
  }
}
