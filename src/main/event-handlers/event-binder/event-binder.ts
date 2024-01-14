import { Container } from 'inversify';
import { Emitter } from '../../../lib/emitter';
import { HyperbeeService, HyperdriveService, DbChangeEvent } from '../../../lib/holepunch/index';
import { TYPES } from '../../di/types';
import * as Hndl from "../index";

export class EventBinder {
    private readonly events: Emitter;

    private readonly beeService: HyperbeeService;

    private readonly driveService: HyperdriveService;

    constructor(
        private readonly diContainer: Container
    ) {
        this.events = this.diContainer.get<Emitter>(TYPES.Events);
        this.beeService = this.diContainer.get<HyperbeeService>(TYPES.HyperbeeService);
        this.driveService = this.diContainer.get<HyperdriveService>(TYPES.HyperdriveService);
    }

    public bindHandlers() {
        const { diContainer, events } = this;

        this.beeService.on(
            DbChangeEvent.name,
            (e) => diContainer.get<Hndl.HyperbeeChangeHandler>(Hndl.HyperbeeChangeHandler).handleEvent(e)
        );

        this.driveService.on(
            DbChangeEvent.name,
            (e) => diContainer.get<Hndl.HyperdriveChangeHandler>(Hndl.HyperdriveChangeHandler).handleEvent(e)
        );

        events.on(Hndl.CopiedToClipboardHandler.event.name, (e) => {
            diContainer.get<Hndl.CopiedToClipboardHandler>(Hndl.CopiedToClipboardHandler).handleEvent(e)
        });

        events.on(Hndl.RendererErrorHandler.event.name, (e) => {
            diContainer.get<Hndl.RendererErrorHandler>(Hndl.RendererErrorHandler).handleEvent(e)
        });

        events.on(Hndl.SessionStatusChangeHandler.event.name, (e) => {
            diContainer.get<Hndl.SessionStatusChangeHandler>(Hndl.SessionStatusChangeHandler).handleEvent(e)
        });
    }
}