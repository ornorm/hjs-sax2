/** @babel */
import {InputStreamReader,BufferedReader} from 'hjs-io/lib/reader';
import {FileInputStream} from "hjs-file/lib/file";
import {
    END_DOCUMENT,
    END_TAG,
    FEATURE_PROCESS_NAMESPACES,
    FEATURE_REPORT_NAMESPACE_ATTRIBUTES,
    FEATURE_VALIDATION,
    START_TAG,
    TEXT,
    XmlPullParser,
    XmlPullParserFactory
} from "hjs-xmlpull/lib/v1";
import {KXmlParser} from "hjs-kxml2/lib/io";

export const DECLARATION_HANDLER_PROPERTY = "http://xml.org/sax/properties/declaration-handler";
export const LEXICAL_HANDLER_PROPERTY = "http://xml.org/sax/properties/lexical-handler";
export const NAMESPACES_FEATURE = "http://xml.org/sax/features/namespaces";
export const NAMESPACE_PREFIXES_FEATURE = "http://xml.org/sax/features/namespace-prefixes";
export const VALIDATION_FEATURE = "http://xml.org/sax/features/validation";
export const APACHE_SCHEMA_VALIDATION_FEATURE = "http://apache.org/xml/features/validation/schema";
export const APACHE_DYNAMIC_VALIDATION_FEATURE = "http://apache.org/xml/features/validation/dynamic";

export class InputSource {

    constructor({systemId = null, input = null, reader = null} = {}) {
        this.encoding = null;
        this.systemId = null;
        this.byteStream = null;
        this.characterStream = null;
        if (systemId) {
            this.setSystemId(systemId);
        } else if (input) {
            this.setByteStream(input);
        } else if (reader) {
            this.setCharacterStream(reader);
        }
    }

    getByteStream() {
        return this.byteStream;
    }

    getCharacterStream() {
        return this.characterStream;
    }

    getEncoding() {
        return this.encoding;
    }

    getPublicId() {
        return this.publicId;
    }

    getSystemId() {
        return this.systemId;
    }

    setByteStream(byteStream) {
        this.byteStream = byteStream;
    }

    setCharacterStream(characterStream) {
        this.characterStream = characterStream;
    }

    setEncoding(encoding) {
        this.encoding = encoding;
    }

    setPublicId(publicId) {
        this.publicId = publicId;
    }

    setSystemId(systemId) {
        this.systemId = systemId;
    }
}

export class DefaultHandler {

    constructor({
                    characters = null,
                    endDocument = null,
                    endElement = null,
                    endPrefixMapping = null,
                    error = null,
                    fatalError = null,
                    ignorableWhitespace = null,
                    notationDecl = null,
                    processingInstruction = null,
                    resolveEntity = null,
                    setDocumentLocator = null,
                    skippedEntity = null,
                    startDocument = null,
                    startElement = null,
                    startPrefixMapping = null,
                    unparsedEntityDecl = null,
                    warning = null
                } = {}) {
        if (characters) {
            this.characters = characters;
        }
        if (endDocument) {
            this.endDocument = endDocument;
        }
        if (endElement) {
            this.endElement = endElement;
        }
        if (endPrefixMapping) {
            this.endPrefixMapping = endPrefixMapping;
        }
        if (error) {
            this.error = error;
        }
        if (fatalError) {
            this.fatalError = fatalError;
        }
        if (ignorableWhitespace) {
            this.ignorableWhitespace = ignorableWhitespace;
        }
        if (notationDecl) {
            this.notationDecl = notationDecl;
        }
        if (processingInstruction) {
            this.processingInstruction = processingInstruction;
        }
        if (resolveEntity) {
            this.resolveEntity = resolveEntity;
        }
        if (setDocumentLocator) {
            this.setDocumentLocator = setDocumentLocator;
        }
        if (skippedEntity) {
            this.skippedEntity = skippedEntity;
        }
        if (startDocument) {
            this.startDocument = startDocument;
        }
        if (startElement) {
            this.startElement = startElement;
        }
        if (startPrefixMapping) {
            this.startPrefixMapping = startPrefixMapping;
        }
        if (unparsedEntityDecl) {
            this.unparsedEntityDecl = unparsedEntityDecl;
        }
        if (warning) {
            this.warning = warning;
        }
    }

    characters(ch, start, length) {
    }

    endDocument() {
    }

    endElement(uri, localName, qName) {
    }

    endPrefixMapping(prefix) {
    }

    error(e) {
    }

    fatalError(e) {
    }

    ignorableWhitespace(ch, start, length) {
    }

    notationDecl(name, publicId, systemId) {
    }

    processingInstruction(target, data) {
    }

    resolveEntity(publicId, systemId) {
        return null;
    }

    setDocumentLocator(locator) {
    }

    skippedEntity(name) {
    }

    startDocument() {
    }

    startElement(uri, localName, qName, attributes) {
    }

    startPrefixMapping(prefix, uri) {
    }

    unparsedEntityDecl(name, publicId, systemId, notationName) {
    }

    warning(e) {
    }
}

export class SaxDriver {

    constructor({parser = null, size = 8192, contentHandler = null} = {}) {
        this.systemId = null;
        if (parser && parser instanceof XmlPullParser) {
            this.pp = parser;
        } else {
            let factory = XmlPullParserFactory.newInstance();
            factory.setNamespaceAware(true);
            this.pp = factory.newPullParser({size});
            if (contentHandler) {
                this.contentHandler = this.errorHandler = contentHandler;
            } else {
                this.contentHandler = this.errorHandler = new DefaultHandler();
            }
        }
    }

    getColumnNumber() {
        return this.pp.getColumnNumber();
    }

    getContentHandler() {
        return this.contentHandler;
    }

    getDTDHandler() {
        return null;
    }

    getEntityResolver() {
        return null;
    }

    getErrorHandler() {
        return this.errorHandler;
    }

    getFeature(name) {
        if (NAMESPACES_FEATURE === name) {
            return this.pp.getFeature(FEATURE_PROCESS_NAMESPACES);
        } else if (NAMESPACE_PREFIXES_FEATURE === name) {
            return this.pp.getFeature(FEATURE_REPORT_NAMESPACE_ATTRIBUTES);
        } else if (VALIDATION_FEATURE === name) {
            return this.pp.getFeature(FEATURE_VALIDATION);
        }
        return this.pp.getFeature(name);
    }

    getIndex(uri, localName = null) {
        let len = this.pp.getAttributeCount();
        if (localName) {
            while (len--) {
                if (this.pp.getAttributeNamespace(len) === uri &&
                    this.pp.getAttributeName(len) === localName) {
                    return len;
                }
            }
            return -1;
        }
        let qName = uri;
        while (len--) {
            if (this.pp.getAttributeName(len) === qName) {
                return len;
            }
        }
        return -1;
    }

    getLength() {
        return this.pp.getAttributeCount();
    }

    getLineNumber() {
        return this.pp.getLineNumber();
    }

    getLocalName(index) {
        return this.pp.getAttributeName(index);
    }

    getProperty(name) {
        if (DECLARATION_HANDLER_PROPERTY === name ||
            LEXICAL_HANDLER_PROPERTY === name) {
            return null;
        }
        return this.pp.getProperty(name);
    }

    getPublicId() {
        return null;
    }

    getQName(index) {
        let prefix = this.pp.getAttributePrefix(index);
        if (prefix) {
            return prefix + ":" + this.pp.getAttributeName(index);
        }
        return this.pp.getAttributeName(index);
    }

    getSystemId() {
        return this.systemId;
    }

    getType(index, localName) {
        if (typeof index === "string") {
            let len = this.pp.getAttributeCount();
            if (localName) {
                let uri = index;
                while (len--) {
                    if (this.pp.getAttributeNamespace(len) === uri &&
                        this.pp.getAttributeName(len) === localName) {
                        return this.pp.getAttributeType(len);
                    }
                }
                return null;
            }
            let qName = index;
            while (len--) {
                if (this.pp.getAttributeName(len) === localName) {
                    return this.pp.getAttributeType(len);
                }
            }
            return null;
        } else {
            return this.pp.getAttributeType(index);
        }
    }

    getURI(index) {
        return this.pp.getAttributeNamespace();
    }

    getValue(index, localName) {
        if (typeof index === "string") {
            if (localName) {
                let uri = index;
                return this.pp.getAttributeValue(uri, localName);
            }
            let qName = index;
            return this.pp.getAttributeValue(null, qName);
        }
        return this.pp.getAttributeValue(index);
    }

    parse(source) {
        if (source instanceof InputSource) {
            this.systemId = source.getSystemId();
            this.contentHandler.setDocumentLocator(this);
            let reader = source.getCharacterStream();
            try {
                if (!reader) {
                    let stream = source.getByteStream();
                    let encoding = source.getEncoding();
                    if (!stream) {
                        this.systemId = source.getSystemId();
                        if (!this.systemId) {
                            let saxException = new ReferenceError("SAXParseException null source systemId");
                            this.errorHandler.fatalError(saxException);
                            return;
                        }
                        try {
                            const fr = new FileInputStream({path: this.systemId});
                            fr.open({
                                onReadable: (err) => {
                                    if (!err) {
                                        let size = fr.available();
                                        let input = new InputStreamReader(fr);
                                        this.pp.setInput(new BufferedReader({input, size}));
                                        this.startDocument();
                                    } else {
                                        this.errorHandler.fatalError(new Error("SAXParseException could not open file with systemId " + this.systemId));
                                    }
                                }
                            });
                            return;
                        } catch (ex) {
                            this.errorHandler.fatalError(new Error("SAXParseException could not open file with systemId " + this.systemId + " " + ex));
                            return;
                        }
                    }
                } else {
                    this.pp.setInput(reader);
                }
            } catch (ex) {
                let saxException = new SyntaxError("SAXParseException parsing initialization error: " + ex);
                this.errorHandler.fatalError(saxException);
                return;
            }
            this.startDocument();
        } else {
            this.parse(new InputSource(source));
        }
    }

    parseSubTree(pp) {
        this.pp = pp;
        let namespaceAware = this.pp.getFeature(FEATURE_PROCESS_NAMESPACES);
        try {
            if (this.pp.getEventType() !== START_TAG) {
                throw new Error("SAXException start tag must be read before skiping subtree " + this.pp.getPositionDescription());
            }
            let holderForStartAndLength = new Array(2);
            let prefix = null;
            let name = null;
            let rawName = "";
            let level = this.pp.getDepth() - 1;
            let type = START_TAG;
            LOOP:
                do {
                    switch (type) {
                        case START_TAG:
                            if (namespaceAware) {
                                let depth = this.pp.getDepth() - 1;
                                let countPrev = (level > depth) ? this.pp.getNamespaceCount(depth) : 0;
                                let count = this.pp.getNamespaceCount(depth + 1);
                                for (let i = countPrev; i < count; i++) {
                                    this.contentHandler.startPrefixMapping(
                                        this.pp.getNamespacePrefix(i),
                                        this.pp.getNamespaceUri(i)
                                    );
                                }
                                name = pp.getName();
                                prefix = pp.getPrefix();
                                if (prefix !== null) {
                                    rawName = "";
                                    rawName += prefix;
                                    rawName += ':';
                                    rawName += name;
                                }
                                this.startElement(this.pp.getNamespace(),
                                    name,
                                    // TODO Fixed this. Was "not equals".
                                    !prefix ? name : rawName);
                            } else {
                                this.startElement(this.pp.getNamespace(),
                                    this.pp.getName(),
                                    this.pp.getName());
                            }
                            break;
                        case TEXT:
                            let chars = this.pp.getTextCharacters(holderForStartAndLength);
                            this.contentHandler.characters(chars,
                                holderForStartAndLength[0], //start
                                holderForStartAndLength[1] //len
                            );
                            break;
                        case END_TAG:
                            if (namespaceAware) {
                                name = this.pp.getName();
                                prefix = this.pp.getPrefix();
                                if (prefix) {
                                    rawName = "";
                                    rawName += prefix;
                                    rawName += ':';
                                    rawName += name;
                                }
                                this.contentHandler.endElement(this.pp.getNamespace(),
                                    name,
                                    prefix ? name : rawName
                                );
                                // when entering show prefixes for all levels!!!!
                                let depth = this.pp.getDepth();
                                let countPrev =
                                    (level > depth) ? this.pp.getNamespaceCount(this.pp.getDepth()) : 0;
                                let count = this.pp.getNamespaceCount(this.pp.getDepth() - 1);
                                // undeclare them in reverse order
                                for (let i = count - 1; i >= countPrev; i--) {
                                    this.contentHandler.endPrefixMapping(
                                        this.pp.getNamespacePrefix(i)
                                    );
                                }
                            } else {
                                this.contentHandler.endElement(this.pp.getNamespace(),
                                    this.pp.getName(),
                                    this.pp.getName()
                                );

                            }
                            break;
                        case END_DOCUMENT:
                            break LOOP;
                    }
                    type = this.pp.next();
                } while (pp.getDepth() > level);
        } catch (ex) {
            let saxException = new Error("SAXParseException parsing error: " + ex);
            this.errorHandler.fatalError(saxException);
        }
    }

    setContentHandler(handler) {
        this.contentHandler = handler;
    }

    setDTDHandler(handler) {

    }

    setEntityResolver(resolver) {

    }

    setErrorHandler(handler) {
        this.errorHandler = handler;
    }

    setFeature(name, value) {
        if (NAMESPACES_FEATURE === name) {
            this.pp.setFeature(XmlPullParser.FEATURE_PROCESS_NAMESPACES, value);
        } else if (NAMESPACE_PREFIXES_FEATURE === name) {
            if (this.pp.getFeature(XmlPullParser.FEATURE_REPORT_NAMESPACE_ATTRIBUTES) !== value) {
                this.pp.setFeature(XmlPullParser.FEATURE_REPORT_NAMESPACE_ATTRIBUTES, value);
            }
        } else if (VALIDATION_FEATURE === name) {
            this.pp.setFeature(XmlPullParser.FEATURE_VALIDATION, value);
        } else {
            this.pp.setFeature(name, value);
        }
    }

    setProperty(name, value) {
        if (DECLARATION_HANDLER_PROPERTY === name) {
            throw new Error("SAXNotSupportedException not supported setting property " + name);
        } else if (LEXICAL_HANDLER_PROPERTY === name) {
            throw new Error("SAXNotSupportedException not supported setting property " + name);
        } else {
            try {
                this.pp.setProperty(name, value);
            } catch (e) {
                throw new Error("SAXNotSupportedException not supported set property " + name + ": " + e.message);
            }
        }
    }

    startDocument() {
        try {
            this.contentHandler.startDocument();
            this.pp.next();
            if (this.pp.getEventType() !== START_TAG) {
                let saxException = new Error("SAXParseException expected start tag not " + this.pp.getPositionDescription());
                this.errorHandler.fatalError(saxException);
                return;
            }
        } catch (ex) {
            let saxException = new Error("SAXParseException parsing initialization error: " + ex);
            this.errorHandler.fatalError(saxException);
            return;
        }
        this.parseSubTree(this.pp);
        this.contentHandler.endDocument();
    }

    startElement(namespace, localName, qName) {
        this.contentHandler.startElement(namespace, localName, qName, this);
    }
}