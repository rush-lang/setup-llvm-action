# setup-llvm-action

GitHub action to setup LLVM.

This action will download, buiild and install a selected version of LLVM, and cache the installation for future workflow executions by default.

## Usage

Adding a step that uses this action will setup LLVM and make it available for subsequent steps (see [action.yml](action.yml)):

```yaml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
    - name: Setup LLVM
      uses: rush-lang/setup-llvm-action@v1
      with:
        llvm-version: 17
```

### Supported version syntax

The `llvm-version` input supports the Semantic Versioning Specification, for more detailed examples please refer to [the semver package documentation](https://github.com/npm/node-semver).

Example:

- Major versions: `14`, `15`, `17`
- Specific versions: `12.0`, `16.0.0-rc4`
- Latest release (default): `latest`

### Minimal build by default

The default input options have been chosen to minimize the size of the resulting LLVM installation. These options may differ from the defaults of the LLVM CMake project. Builds that require anything beyond a minimal installation of the headers and libraries must be specifically configured with the action inputs (see [action.yml](action.yml)).

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE.txt)