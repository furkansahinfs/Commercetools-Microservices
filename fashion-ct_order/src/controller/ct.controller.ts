import { CTCartService, CTOrderService } from "src/services";

export class CTController {
  protected ctCartService: CTCartService;
  protected ctOrderService: CTOrderService;
  constructor(ctCartService: CTCartService, ctOrderService: CTOrderService) {
    this.ctCartService = ctCartService;
    this.ctOrderService = ctOrderService;
  }
}
