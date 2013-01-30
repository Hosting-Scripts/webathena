"use strict";

module("asn1");

// Our bitstrings are arrays.
function bytesToBitString(b, remainder) {
    var bits = [];
    for (var i = 0; i < b.length; i++) {
        var octet = b.charCodeAt(i);
        for (var m = (1 << 7); m > 0; m >>= 1) {
            bits.push((octet & m) ? 1 : 0);
        }
    }
    return bits.slice(0, bits.length - remainder);
}

function isEncoding(type, input, output, msg) {
    deepEqual(type.decodeDER(output), input, msg + " - decode");
    deepEqual(type.encodeDER(input), output, msg + " - encode");
}

test("X.690 examples", function() {
    equal(asn1.encodeLengthDER(38), "\x26", "Length - short form");
    equal(asn1.encodeLengthDER(201), "\x81\xc9", "Length - long form");

    isEncoding(asn1.BOOLEAN, true, "\x01\x01\xff", "BOOLEAN");
    isEncoding(asn1.BIT_STRING,
               bytesToBitString("\x0a\x3b\x5f\x29\x1c\xd0", 4),
               "\x03\x07\x04\x0a\x3b\x5f\x29\x1c\xd0",
               "BIT STRING");
    isEncoding(asn1.NULL, null, "\x05\x00", "NULL");
    // IA5String changed to GeneralString.
    isEncoding(new asn1.SEQUENCE([{id: "name", type: asn1.GeneralString},
                                  {id: "ok", type: asn1.BOOLEAN}]),
               {name: "Smith", ok: true},
               "\x30\x0a\x1b\x05Smith\x01\x01\xff");

    // VisibleString changed to GeneralString.
    var Type1 = asn1.GeneralString;
    var Type2 = Type1.implicitlyTagged(asn1.tag(3, asn1.TAG_APPLICATION));
    var Type3 = Type2.tagged(asn1.tag(2));
    var Type4 = Type3.implicitlyTagged(asn1.tag(7, asn1.TAG_APPLICATION));
    var Type5 = Type2.implicitlyTagged(asn1.tag(2));
    isEncoding(Type1, "Jones", "\x1b\x05\x4a\x6f\x6e\x65\x73",
               "Prefixed Type1");
    isEncoding(Type2, "Jones", "\x43\x05\x4a\x6f\x6e\x65\x73",
               "Prefixed Type2");
    isEncoding(Type3, "Jones", "\xa2\x07\x43\x05\x4a\x6f\x6e\x65\x73",
               "Prefixed Type3");
    isEncoding(Type4, "Jones", "\x67\x07\x43\x05\x4a\x6f\x6e\x65\x73",
               "Prefixed Type4");
    isEncoding(Type5, "Jones", "\x82\x05\x4a\x6f\x6e\x65\x73",
               "Prefixed Type5");

    isEncoding(asn1.OBJECT_IDENTIFIER, "2.100.3", "\x06\x03\x81\x34\x03",
               "OBJECT IDENTIFIER");

    // VisibleString changed to GeneralString.
    isEncoding(asn1.GeneralString, "Jones", "\x1b\x05\x4a\x6f\x6e\x65\x73",
               "GeneralString");
});

test("X.690 Annex A example (modified)", function() {
    // This isn't quite the sample A.1. The following changes were
    // made:
    // - All strings changed to GeneralString
    // - All SETs changed to SEQUENCEs
    // - All DEFAULT fields changed to OPTIONAL.
    var Date = asn1.GeneralString.implicitlyTagged(
        asn1.tag(3, asn1.TAG_PRIMITIVE, asn1.TAG_APPLICATION));
    var EmployeeNumber = asn1.INTEGER.implicitlyTagged(
        asn1.tag(2, asn1.TAG_PRIMITIVE, asn1.TAG_APPLICATION));
    var Name = new asn1.SEQUENCE([
        {id: "givenName", type: asn1.GeneralString},
        {id: "initial", type: asn1.GeneralString},
        {id: "familyName", type: asn1.GeneralString}
    ]).implicitlyTagged(asn1.tag(1, asn1.TAG_CONSTRUCTED,
                                 asn1.TAG_APPLICATION));
    var ChildInformation = new asn1.SEQUENCE([
        {id: "name", type: Name},
        {id: "dateOfBirth", type: Date.tagged(asn1.tag(0))}
    ]);
    var PersonnelRecord = new asn1.SEQUENCE([
        {id: "name", type: Name},
        {id: "title", type: asn1.GeneralString.tagged(asn1.tag(0))},
        {id: "number", type: EmployeeNumber},
        {id: "dateOfHire", type: Date.tagged(asn1.tag(1))},
        {id: "nameOfSpouse", type: Name.tagged(asn1.tag(2))},
        {id: "children",
         type: new asn1.SEQUENCE_OF(ChildInformation).implicitlyTagged(
             asn1.tag(3)),
         optional: true}
    ]).implicitlyTagged(asn1.tag(0, asn1.TAG_CONSTRUCTED,
                                 asn1.TAG_APPLICATION));

    var value = {
        name: {givenName: "John", initial: "P", familyName: "Smith"},
        title: "Director",
        number: 51,
        dateOfHire: "19710917",
        nameOfSpouse: {givenName: "Mary", initial: "T", familyName: "Smith"},
        children: [
            {
                name: {givenName: "Ralph", initial: "T", familyName: "Smith"},
                dateOfBirth: "19571111"
            },
            {
                name: {givenName: "Susan", initial: "B", familyName: "Jones"},
                dateOfBirth: "19590717"
            }
        ]
    };

    isEncoding(PersonnelRecord, value,
               "\x60\x81\x85\x61\x10\x1b\x04John\x1b\x01P\x1b\x05Smith" +
               "\xa0\x0a\x1b\x08Director\x42\x01\x33" +
               "\xa1\x0a\x43\x0819710917\xa2\x12\x61\x10" +
               "\x1b\x04Mary\x1b\x01T\x1b\x05Smith" +
               "\xa3\x42\x30\x1f\x61\x11\x1b\x05Ralph" +
               "\x1b\x01T\x1b\x05Smith\xa0\x0a\x43\x08" +
               "19571111\x30\x1f\x61\x11\x1b\x05Susan" +
               "\x1b\x01B\x1b\x05Jones\xa0\x0a\x43\x0819590717",
               "PersonnelRecord");
});
