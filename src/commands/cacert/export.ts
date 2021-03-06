/*********************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { Command, flags } from '@oclif/command'
import { string } from '@oclif/parser/lib/flags'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import { CheHelper } from '../../api/che'
import { KubeHelper } from '../../api/kube'
import { cheNamespace, skipKubeHealthzCheck } from '../../common-flags'
import { DEFAULT_CA_CERT_FILE_NAME } from '../../constants'

export default class Export extends Command {
  static description = 'Retrieves Eclipse Che self-signed certificate'

  static flags = {
    help: flags.help({ char: 'h' }),
    chenamespace: cheNamespace,
    destination: string({
      char: 'd',
      description: `Destination where to store Che self-signed CA certificate.
                    If the destination is a file (might not exist), then the certificate will be saved there in PEM format.
                    If the destination is a directory, then ${DEFAULT_CA_CERT_FILE_NAME} file will be created there with Che certificate in PEM format.
                    If this option is ommited, then Che certificate will be stored in user's home directory as ${DEFAULT_CA_CERT_FILE_NAME}`,
      env: 'CHE_CA_CERT_LOCATION',
      default: ''
    }),
    'skip-kubernetes-health-check': skipKubeHealthzCheck
  }

  async run() {
    const { flags } = this.parse(Export)
    const kube = new KubeHelper(flags)
    const cheHelper = new CheHelper(flags)

    if (!await kube.hasReadPermissionsForNamespace(flags.chenamespace)) {
      throw new Error(`E_PERM_DENIED - Permission denied: no read access to '${flags.chenamespace}' namespace`)
    }
    if (!await cheHelper.cheNamespaceExist(flags.chenamespace)) {
      throw new Error(`E_BAD_NS - Namespace ${flags.chenamespace} does not exist. Please specify it with --chenamespace flag`)
    }

    try {
      const cheCaCert = await cheHelper.retrieveCheCaCert(flags.chenamespace)
      if (cheCaCert) {
        const targetFile = await cheHelper.saveCheCaCert(cheCaCert, this.getTargetFile(flags.destination))
        this.log(`Eclipse Che self-signed CA certificate is exported to ${targetFile}`)
      } else {
        this.log('Self signed certificate secret not found. Is commonly trusted certificate used?')
      }
    } catch (error) {
      this.error(error)
    }
  }

  /**
   * Handles certificate target location and returns string which points to the target file.
   */
  private getTargetFile(destinaton: string): string {
    if (!destinaton) {
      return path.join(os.homedir(), DEFAULT_CA_CERT_FILE_NAME)
    }

    if (fs.existsSync(destinaton)) {
      return fs.lstatSync(destinaton).isDirectory() ? path.join(destinaton, DEFAULT_CA_CERT_FILE_NAME) : destinaton
    }

    this.error(`Given path "${destinaton}" doesn't exist.`)
  }

}
