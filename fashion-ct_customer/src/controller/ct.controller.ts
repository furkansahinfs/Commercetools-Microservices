import { CTCustomerService } from "src/services";

export class CTController {
  protected ctCustomerService: CTCustomerService;
  constructor(ctCustomerService: CTCustomerService) {
    this.ctCustomerService = ctCustomerService;
  }
}
