import Filters from '@/models/filters';

export default class ClassConverter {
  private static TypeReferences : { [key: string]: string; } = {
    string: 'string',
    String: 'string',
    char: 'string',
    Char: 'string',
    Guid: 'string',

    int: 'number',
    uint: 'number',
    nint: 'number',
    nuint: 'number',
    long: 'number',
    ulong: 'number',
    short: 'number',
    ushort: 'number',
    Int16: 'number',
    UInt16: 'number',
    Int32: 'number',
    UInt32: 'number',
    Int64: 'number',
    UInt64: 'number',
    IntPtr: 'number',
    UIntPtr: 'number',

    float: 'number',
    Single: 'number',
    double: 'number',
    Double: 'number',
    decimal: 'number',
    Decimal: 'number',

    bool: 'boolean',
    Boolean: 'boolean',

    DateTime: 'Date',
  };

  public static Convert(code: string, filters: Filters): string {
    let output = '';

    if (!code) {
      return output;
    }

    const lines = code.replace('\r', '').split('\n');
    let depth = 0;
    let inClass = false;
    let inEnum = false;
    let jsonProperty = '';

    lines.forEach((l) => {
      const line = l.trim();

      if (line) {
        const lineSplit = line.split(' ');

        // Depth management
        const startDepth = depth;
        depth += (line.match(/{/g) || []).length;
        depth -= (line.match(/}/g) || []).length;

        if (line.indexOf('[JsonProperty') !== -1) {
          const jsonPropSplit = line.split('"');
          jsonProperty = jsonPropSplit.length > 1 ? jsonPropSplit[1] : '';
        }

        if (inEnum && depth < startDepth) {
          inEnum = false;
          output += '}\r\n\r\n';
        } else if (inClass && depth < startDepth) {
          inClass = false;
          output += '}\r\n\r\n';
        }

        // Enum items
        if (inEnum) {
          let enumValue = line.replace(/{|}/, '');
          let enumIndex = '';
          if (enumValue.endsWith(',')) {
            enumValue = enumValue.substr(0, enumValue.length - 1);
          }
          if (enumValue.indexOf('=') !== -1) {
            const enumSplit = enumValue.split('=');
            if (enumSplit.length > 1) {
              enumValue = enumSplit[0].trim();
              enumIndex = enumSplit[1].trim();
            }
          }

          if (enumValue) {
            if (enumIndex) {
              output += `  ${enumValue} = ${enumIndex},\r\n`;
            } else {
              output += `  ${enumValue},\r\n`;
            }
          }

          jsonProperty = '';
        } else {
          // Prop
          if (inClass && lineSplit.length >= 3 && lineSplit[0] === 'public'
            && line.indexOf('(') === -1) {
            let csharpType = lineSplit[1];
            const csharpName = lineSplit[2];
            let propertyName = csharpName;
            let type = csharpType;
            let array = false;
            let nullable = false;

            // JsonProperty management
            if (jsonProperty) {
              propertyName = jsonProperty;
            }

            // Array management
            if (csharpType.startsWith('List<') && csharpType.endsWith('>')) {
              array = true;
              csharpType = csharpType.substr(5, csharpType.length - 6);
              type = csharpType;
            } else if (csharpType.startsWith('IEnumerable<')
              && csharpType.endsWith('>')) {
              array = true;
              csharpType = csharpType.substr(12, csharpType.length - 13);
              type = csharpType;
            } else if (csharpType.endsWith('[]')) {
              array = true;
              csharpType = csharpType.substr(0, csharpType.length - 2);
              type = csharpType;
            } else if (csharpType.endsWith('?')) {
              nullable = true;
              csharpType = csharpType.substr(0, csharpType.length - 1);
              type = csharpType;
            }

            if (csharpType.startsWith('System.')) {
              csharpType = csharpType.substr(7, csharpType.length - 8);
              type = csharpType;
            }

            // Native type
            if (Object.keys(this.TypeReferences).indexOf(csharpType) !== -1) {
              type = this.TypeReferences[csharpType];
            } else if (filters.interfacePrefix) {
              type = `I${type}`;
            }

            propertyName = propertyName.length > 1 && !filters.upperCamelCase
              ? propertyName[0].toLowerCase() + propertyName.substr(1)
              : propertyName;
            const nullStr = nullable ? '?' : '';
            const arrayStr = array ? '[]' : '';
            output += `  ${propertyName}${nullStr}: ${type}${arrayStr};\r\n`;

            jsonProperty = '';
          }

          // Class
          if (line.indexOf(' class ') !== -1) {
            const classIndex = lineSplit.indexOf('class');
            let className = lineSplit.length > (classIndex + 1)
              ? lineSplit[classIndex + 1] : '';
            let parentClass = '';
            if (line.indexOf(':') !== -1) {
              let cleanLine = line;
              if (line.indexOf('{') !== -1) {
                cleanLine = line.substr(0, line.indexOf('{'));
              }
              const classSplit = cleanLine.split(':');
              if (classSplit.length > 1) {
                parentClass = classSplit[1].trim();
              }
            }

            inClass = true;
            className = className.replace(':', '').trim();
            className = filters.interfacePrefix ? `I${className}` : className;
            const parentClassStr = parentClass ? ` extends ${parentClass}` : '';
            output += `export interface ${className}${parentClassStr} {\r\n`;

            jsonProperty = '';
          }

          // Enum
          if (line.indexOf(' enum ') !== -1) {
            const enumIndex = lineSplit.indexOf('enum');
            const enumName = lineSplit.length > (enumIndex + 1)
              ? lineSplit[enumIndex + 1] : '';

            inEnum = true;
            output += `export enum ${enumName} {\r\n`;

            jsonProperty = '';
          }
        }
      }
    });

    return output;
  }
}
