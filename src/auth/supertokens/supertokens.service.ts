import {Inject, Injectable} from '@nestjs/common';
import supertokens from "supertokens-node";
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import DashBoard from 'supertokens-node/recipe/dashboard';

import {ConfigInjectionToken, AuthModuleConfig} from "../config.interface";

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        EmailPassword.init(),
        Session.init(),
        DashBoard.init(),
        UserRoles.init()
      ],
    });
  }
}