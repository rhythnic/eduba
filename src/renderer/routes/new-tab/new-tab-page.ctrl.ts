import { FormController } from "../../controllers/form.ctrl";
import { inject, injectable } from "inversify";
import { TYPES } from "@/renderer/di";
import { signalState } from "@/lib/signal-state";
import { ComponentController } from "@/renderer/controllers/component.ctrl";
import { SidebarStore } from "@/renderer/stores/sidebar.store";

export interface NewTabPageProps {
  pageId: string;
}

export interface NewTabFormState {
  href: string;
}

@injectable()
export class NewTabPageController extends ComponentController<NewTabPageProps> {
  public form: FormController<NewTabFormState>;

  constructor(
    @inject(TYPES.LocalStorage) private readonly storage: Storage,
    @inject(SidebarStore) private readonly sidebarStore: SidebarStore
  ) {
    super();

    this.form = new FormController(
      this.insertPage,
      signalState({ href: "" })
    );
  }

  initialize(props: NewTabPageProps): void {
    this.form.state._configure({ storage: this.storage, key: `${props.pageId}-form` })
  }
  
  insertPage = ({ href }: NewTabFormState) => {
    this.sidebarStore.addPage({ href });
  };
}
