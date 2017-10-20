let expect = require('chai').expect;

module.exports.test = function (Observer) {
    
    describe('create observer', function () {
        it('Observer.call(undefined) should throw error', function () {
            expect(function () {
                Observer.call(undefined)
            }).to.throw(Error);
        });
          it('Observer.call(null) should throw error', function () {
            expect(function () {
                Observer.call(null)
            }).to.throw(Error);
        });
         it('Observer.call(123) should throw error', function () {
            expect(function () {
                Observer.call(123)
            }).to.throw(Error);
        });
         it('Observer.call(\' \') should throw error', function () {
            expect(function () {
                Observer.call('')
            }).to.throw(Error);
        });
    
        it('add Observer to object', function () {
            expect(typeof Observer.call({}).listen==="function").to.be.equal(true);
        });
    
        it('create Observer ', function () {
            expect(new Observer() instanceof Observer).to.be.equal(true);
        });
        
         it('create Observer ', function () {
            expect(typeof new Observer().listen==="function").to.be.equal(true);
        });
        
    });
    
    
    describe('observer  function test ', function () {
        function Person(){
           Observer.call(this);
           this.age=18;
           this.height=183;
       }
       
       let person=new Person();
       let that,a1,a2,a3,count=0;
        person.listen('e',function(a,b,c){
            that=this;
            a1=a;a2=b;a3=c;
        });
        person.trigger('e',11,22,33);
    
        person.on(' f  g h  i   j',function(a,b,c){
            that=this;
            a1=a;a2=b;a3=c;
        });
        //listen
        it('listen', function () {
            expect(that===person).to.be.equal(true);
        });
         it('\'a1\' should be 11', function () {
            expect(a1===11).to.be.equal(true);
        });
         it('\'a2\' should be 11', function () {
            expect(a2===22).to.be.equal(true);
        });
         it('\'a3\' should be 33', function () {
            expect(a3===33).to.be.equal(true);
        });
    
        //on
        it('\'that\' should be person', function () {
            person.trigger('f','ff');
            expect(that===person).to.be.equal(true);
        });
        it('\'a1\' should be ff', function () {
            person.trigger('f','ff');
            expect(a1==='ff').to.be.equal(true);
        });
        
        it('\'that\' should be person', function () {
            person.trigger('g','gg');
            expect(that===person).to.be.equal(true);
        });
        it('\'a2\' should be gg', function () {
            person.trigger('g',1,'gg');
            expect(a2==='gg').to.be.equal(true);
        });
        
        it('\'that\' should be person', function () {
            person.trigger('j','jj');
            expect(that===person).to.be.equal(true);
        });
        it('\'a3\' should be jj', function () {
            person.trigger('j',1,'gg','jj');
            expect(a3==='jj').to.be.equal(true);
        });
        
        //listen again
        it('listen again', function () {
            person.listen('e',function(){
                a3=false;
            });
            person.trigger('e',1,'gg','a3');
            expect(a3===false).to.be.equal(true);
        });
        
        //remove
        it('remove', function () {
            let p=3;
            function cb(a){
                p=a;
            }
            person.listen('p',cb);
            person.trigger('p',1);
            expect(p===1).to.be.equal(true);
            person.remove('p',cb);
            person.trigger('p',2);
            expect(p===1).to.be.equal(true);
        });
        
        //error
        it('person.listen() should throw error', function () {
            expect(function () {
                person.listen()
            }).to.throw(Error);
        });
         it('person.on() should throw error', function () {
            expect(function () {
                person.on()
            }).to.throw(Error);
        });
         it('person.one() should throw error', function () {
            expect(function () {
                person.one()
            }).to.throw(Error);
        });
           it('person.remove() should throw error', function () {
            expect(function () {
                person.remove()
            }).to.throw(Error);
        });
        
        
    });
    
    describe('create observer with option', function () {
        let observer=new Observer({needCache:true});
        let result;
        observer.trigger('event','a','b','c');
        it('Need to perform a callback function', function () {
            observer.listen('event',function(a,b,c){
                result=b
            });
            expect(result==='b').to.be.equal(true);
            observer.listen('event',function(a,b,c){
                result=c
            });
            expect(result==='b').to.be.equal(true);
        });
        
    })
    
};
