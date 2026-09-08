import {info} from "../utils/Logger";
import {PatchHandler} from "../patches/PatchHandler";
import {PageLoader} from "../pages/PageLoader";
import {CommandClient} from "../commands/messaging/CommandClient";
import {URLChangeCommand} from "../commands/impl/main/URLChangeCommand";

info("Main-Content has started!")
export const commandClient = new CommandClient("main")
export const mainPageLoader = new PageLoader()
export const patchHandler = new PatchHandler()


commandClient.register(new URLChangeCommand())

const onPageLoad = async () => {


}


onPageLoad()
