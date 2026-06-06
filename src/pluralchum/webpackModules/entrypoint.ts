import { greeting } from "@moonlight-mod/wp/pluralchum_someLibrary";

const logger = moonlight.getLogger("pluralchum/entrypoint");
logger.info("Hello from entrypoint!");
logger.info("someLibrary exports:", greeting);

const natives = moonlight.getNatives("pluralchum");
logger.info("node exports:", natives);
