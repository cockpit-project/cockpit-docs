
// AsciiDoctor.js extension
//
// Replaces all mentions of {cockpit-version} with the corresponding version
// without using it as an AsciiDoc attribute. Instead of setting the attribute
// based on the version itself this approach is used as Cockpit 365 or lower
// have the cockpit-version attribute locked and cannot be replaced.
//
// Usage:
//
//   Documentation for Cockpit {cockpit-version}.

const MAIN_BRANCH = "main";

export function register(registry) {

  registry.preprocessor(function () {
    this.process(function (doc, reader) {
      const version = doc.getAttribute("page-version");
      const lines = reader.lines.map((line) => {
        if (line.includes("{cockpit-version}")) {
          return line.replace("{cockpit-version}", version)
        }
        return line
      });
      reader.lines = lines;
      return reader
    });
  });
};
