/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/
import { boolean, string } from '@oclif/parser/lib/flags'

import { DEFAULT_DEV_WORKSPACE_CONTROLLER_NAMESPACE, DOC_LINK_OBTAIN_ACCESS_TOKEN, DOC_LINK_OBTAIN_ACCESS_TOKEN_OAUTH } from './constants'

export const cheNamespace = string({
  char: 'n',
  description: 'Kubernetes namespace where Eclipse Che server is supposed to be deployed',
  default: 'che',
  env: 'CHE_NAMESPACE'
})

export const devWorkspaceControllerNamespace = string({
  description: 'Namespace for the DevWorkspace controller.  This parameter is used only when the workspace engine is the DevWorkspace',
  default: DEFAULT_DEV_WORKSPACE_CONTROLLER_NAMESPACE,
  env: 'DEV_WORKSPACE_OPERATOR_NAMESPACE',
})

export const cheDeployment = string({
  description: 'Eclipse Che deployment name',
  default: 'che',
  env: 'CHE_DEPLOYMENT'
})

export const listrRenderer = string({
  description: 'Listr renderer',
  options: ['default', 'silent', 'verbose'],
  default: 'default'
})

export const ACCESS_TOKEN_KEY = 'access-token'
export const accessToken = string({
  description: `Eclipse Che OIDC Access Token. See the documentation how to obtain token: ${DOC_LINK_OBTAIN_ACCESS_TOKEN} and ${DOC_LINK_OBTAIN_ACCESS_TOKEN_OAUTH}.`,
  env: 'CHE_ACCESS_TOKEN'
})

export const skipKubeHealthzCheck = boolean({
  description: 'Skip Kubernetes health check',
  default: false
})

export const CHE_API_ENDPOINT_KEY = 'che-api-endpoint'
export const cheApiEndpoint = string({
  description: 'Eclipse Che server API endpoint',
  env: 'CHE_API_ENDPOINT',
  required: false,
})
